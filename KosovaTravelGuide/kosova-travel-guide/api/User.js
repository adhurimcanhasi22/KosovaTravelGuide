const express = require('express');
const router = express.Router();

//mongodb user model
const User = require('./../models/User');

//mongodb user verification model
const UserVerification = require('./../models/UserVerification');

// email handler
const nodemailer = require('nodemailer');

// unique string
const { v4: uuidv4 } = require('uuid');

// env variables
require('dotenv').config();

// password handler
const bcrypt = require('bcrypt');

// path for static verified page
const path = require('path');

// nodemailer stuff

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

// testing success

transporter.verify((err, success) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Ready to send emails');
    console.log(success);
  }
});

router.post('/signup', (req, res) => {
  let { name, email, password } = req.body;
  name = name.trim();
  email = email.trim();
  password = password.trim();

  if (name == '' || email == '' || password == '') {
    res.json({
      status: 'FAILED',
      message: 'Please fill all the fields',
    });
  } else if (!/^[a-zA-Z ]*$/.test(name)) {
    res.json({
      status: 'FAILED',
      message: 'Invalid name entered',
    });
  } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    res.json({
      status: 'FAILED',
      message: 'Invalid email entered',
    });
  } else if (password.length < 8) {
    res.json({
      status: 'FAILED',
      message:
        'Password must be at least 8 characters long and contain at least one letter and one number',
    });
  } else {
    //Checking if the user already exists

    User.find({ email })
      .then((result) => {
        if (result.length) {
          // A user already exists
          res.json({
            status: 'FAILED',
            message: 'User with the provided email already exists',
          });
        } else {
          // Try to create a new user

          //password handling
          const saltRounds = 10;
          bcrypt
            .hash(password, saltRounds)
            .then((hashedPassword) => {
              const newUser = new User({
                name,
                email,
                password: hashedPassword,
                verified: false,
              });

              newUser
                .save()
                .then((result) => {
                  // Send verification email
                  sendVerificationEmail(result, res);
                })
                .catch((err) => {
                  console.log(err);
                  res.json({
                    status: 'FAILED',
                    message: 'An error occurred while creating the user',
                  });
                });
            })
            .catch((err) => {
              res.json({
                status: 'FAILED',
                message: 'An error occurred while hashing the password',
              });
            });
        }
      })
      .catch((err) => {
        console.log(err);
        res.json({
          status: 'FAILED',
          message: 'An error occurred while checking for existing user',
        });
      });
  }
});

// send verificarion email
const sendVerificationEmail = ({ _id, email }, res) => {
  // url to be used for verification
  const currentUrl = 'http://localhost:5000/';

  const uniqueString = uuidv4() + _id;

  // mail options
  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: 'Verify your email',
    html: `<p>Verify your email address to complete the signup to your account.</p><p>This link <b>expires in 6 hours.</b></p><p>Press <a href=${
      currentUrl + 'user/verify/' + _id + '/' + uniqueString
    }> here<a/> to proceed.</p>`,
  };

  // hash the uniqueString
  const saltRounds = 10;
  bcrypt
    .hash(uniqueString, saltRounds)
    .then((hashedUniqueString) => {
      // set values in userVerification collection
      const newVerification = new UserVerification({
        userId: _id,
        uniqueString: hashedUniqueString,
        createdAt: Date.now(),
        expiresAt: Date.now() + 21600000,
      });

      newVerification
        .save()
        .then(() => {
          transporter
            .sendMail(mailOptions)
            .then(() => {
              // email sent and verification data saved
              res.json({
                status: 'PENDING',
                message:
                  'Verification email sent successfully. Please check your inbox.',
              });
            })
            .catch((err) => {
              console.log(err);
              res.json({
                status: 'FAILED',
                message: 'An error occurred while sending the email.',
              });
            });
        })
        .catch((err) => {
          console.log(err);
          res.json({
            status: 'FAILED',
            message: 'An error occurred while saving the verification data.',
          });
        });
    })
    .catch(() => {
      res.json({
        status: 'FAILED',
        message: 'An error occurred while hashing the unique string.',
      });
    });
};
// verify email
router.get('/verify/:userId/:uniqueString', (req, res) => {
  let { userId, uniqueString } = req.params;

  UserVerification.find({ userId })
    .then((result) => {
      if (result.length > 0) {
        // user verification record exist so we proceed

        const { expiresAt } = result[0];
        const hashedUniqueString = result[0].uniqueString;

        // checking for expired unique string

        if (expiresAt < Date.now()) {
          // record has expired so we delete it
          UserVerification.deleteOne({ userId })
            .then((result) => {
              User.deleteOne({ _id: userId })
                .then(() => {
                  let message =
                    'Link has expired. Please sign up again to create a new account.';
                  res.redirect(`/user/verified/error=true&message=${message}`);
                })
                .catch((error) => {
                  let message =
                    'Clearing user with expired unique string failed';
                  res.redirect(`/user/verified/error=true&message=${message}`);
                });
            })
            .catch((error) => {
              console.log(error);
              let message =
                'An error occurred while clearing expired user verification record.';
              res.redirect(`/user/verified/error=true&message=${message}`);
            });
        } else {
          // valid record exists so we validate it
          // First compare the hashed unique string

          bcrypt
            .compare(uniqueString, hashedUniqueString)
            .then((result) => {
              if (result) {
                // strings match

                User.updateOne({ _id: userId }, { verified: true })
                  .then(() => {
                    UserVerification.deleteOne({ userId })
                      .then(() => {
                        res.sendFile(
                          path.join(
                            __dirname,
                            '../../app/user/verified/success.html'
                          )
                        );
                      })
                      .catch((error) => {
                        console.log(error);
                        let message =
                          'An error occurred while finalizing successful verification.';
                        res.redirect(
                          `/user/verified/error=true&message=${message}`
                        );
                      });
                  })
                  .catch((error) => {
                    console.log(error);
                    let message =
                      'An error occurred while updating user record.';
                    res.redirect(
                      `/user/verified/error=true&message=${message}`
                    );
                  });
              } else {
                // exisitng record but incorrect verification details passed
                let message =
                  'Invalid verification details passed. Check your inbox.';
                res.redirect(`/user/verified/error=true&message=${message}`);
              }
            })
            .catch((error) => {
              let message = 'An error occurred while comparing unique strings.';
              res.redirect(`/user/verified/error=true&message=${message}`);
            });
        }
      } else {
        // user verification doesn't exist
        let message =
          'Account record doesn/t exist or has been verified already. Please log in. ';
        res.redirect(`/user/verified/error=true&message=${message}`);
      }
    })
    .catch((error) => {
      console.log(error);
      let message =
        'An error occurred while checking for exisiting user verification record';
      res.redirect(`/user/verified/error=true&message=${message}`);
    });
});

//verified page route
router.get('/verified', (req, res) => {
  if (req.query.error === 'true') {
    res.sendFile(path.join(__dirname, '../../app/user/verified/error.html'));
  } else {
    res.sendFile(path.join(__dirname, '../../app/user/verified/success.html'));
  }
});
// Signin
router.post('/signin', (req, res) => {
  let { email, password } = req.body;
  email = email.trim();
  password = password.trim();
  if (email == '' || password == '') {
    res.json({
      status: 'FAILED',
      message: 'Please fill all the fields',
    });
  } else {
    //Check if the user exists
    User.find({ email })
      .then((data) => {
        if (data.length) {
          //User exists

          // check if user is verified
          if (!data[0].verified) {
            res.json({
              status: 'FAILED',
              message:
                'Please verify your email address to sign in to your account.',
            });
          } else {
            const hashedPassword = data[0].password;
            bcrypt
              .compare(password, hashedPassword)
              .then((result) => {
                if (result) {
                  //Password matched
                  res.json({
                    status: 'SUCCESS',
                    message: 'User signed in successfully',
                    data: data,
                  });
                } else {
                  //Password not matched
                  res.json({
                    status: 'FAILED',
                    message: 'Invalid password entered',
                  });
                }
              })
              .catch((err) => {
                console.log(err);
                res.json({
                  status: 'FAILED',
                  message: 'An error occurred while comparing passwords',
                });
              });
          }
        } else {
          //User not found
          res.json({
            status: 'FAILED',
            message: 'User not found',
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.json({
          status: 'FAILED',
          message: 'An error occurred while checking for existing user',
        });
      });
  }
});

module.exports = router;
