const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

//mongodb user model
const User = require('./../models/User');

//mongodb user verification model
const UserVerification = require('./../models/UserVerification');

//mongodb password reset model
const PasswordReset = require('./../models/PasswordReset');

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

// Middleware to parse cookies
router.use(cookieParser());

// Function to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email }, // Payload
    process.env.JWT_SECRET, // Secret key
    { expiresIn: process.env.JWT_EXPIRATION } // Expiration time
  );
};

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
  const { name = '', email = '', password = '' } = req.body;
  const trimmedName = name.toString().trim();
  const trimmedEmail = email.toString().trim();
  const trimmedPassword = password.toString().trim();
  if (trimmedName == '' || trimmedEmail == '' || trimmedPassword == '') {
    return res.json({
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
    html: `<p>Verify your email address...</p>
           <a href="${currentUrl}user/verify/${_id}/${uniqueString}">Verify Email</a>`,
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

  UserVerification.find({ userId: req.params.userId })
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
                  res.redirect(
                    `http://localhost:3000/verified-error?message=${message}`
                  );
                })
                .catch((error) => {
                  let message =
                    'Clearing user with expired unique string failed';
                  res.redirect(
                    `http://localhost:3000/verified-error?message=${message}`
                  );
                });
            })
            .catch((error) => {
              console.log(error);
              let message =
                'An error occurred while clearing expired user verification record.';
              res.redirect(
                `http://localhost:3000/verified-error?message=${message}`
              );
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
                        res.redirect(`http://localhost:3000/verified-success`);
                      })
                      .catch((error) => {
                        console.log(error);
                        let message =
                          'An error occurred while finalizing successful verification.';
                        res.redirect(
                          `http://localhost:3000/verified-error?message=${message}`
                        );
                      });
                  })
                  .catch((error) => {
                    console.log(error);
                    let message =
                      'An error occurred while updating user record.';
                    res.redirect(
                      `http://localhost:3000/verified-error?message=${message}`
                    );
                  });
              } else {
                // exisitng record but incorrect verification details passed
                let message =
                  'Invalid verification details passed. Check your inbox.';
                res.redirect(
                  `http://localhost:3000/verified-error?message=${message}`
                );
              }
            })
            .catch((error) => {
              let message = 'An error occurred while comparing unique strings.';
              res.redirect(
                `http://localhost:3000/verified-error?message=${message}`
              );
            });
        }
      } else {
        // user verification doesn't exist
        let message =
          'Account record doesn/t exist or has been verified already. Please log in. ';
        res.redirect(`http://localhost:3000/verified-error?message=${message}`);
      }
    })
    .catch((error) => {
      console.log(error);
      let message =
        'An error occurred while checking for exisiting user verification record';
      res.redirect(`http://localhost:3000/verified-error?message=${message}`);
    });
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
                  //Password matched, generate JWT
                  //const token = generateToken(user);

                  //Send the JWT as an HTTP-only cookie
                  //res.cookie('token', token, {
                  //httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
                  //secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
                  //maxAge: 3600000, // 1 hour (in milliseconds)
                  // });

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

// Logout Route
router.post('/logout', (req, res) => {
  // Clear the token cookie
  res.clearCookie('token'); // Ensure the cookie name matches what you used in the login route

  // Respond with success message
  res.status(200).json({ message: 'Logged out successfully' });
});

// Password reset stuff
router.post('/requestPasswordReset', (req, res) => {
  const { email, redirectUrl } = req.body;

  User.find({ email })
    .then((data) => {
      if (data.length) {
        // user exists

        // check if user is verified

        if (!data[0].verified) {
          res.json({
            status: 'FAILED',
            message: 'Email has not been verified yet. Check your inbox.',
          });
        } else {
          // proceed with email to reset password

          sendResetEmail(data[0], redirectUrl, res);
        }
      } else {
        res.json({
          status: 'FAILED',
          message: 'No account found with the provided email address',
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
});

// send password reset email
const sendResetEmail = ({ _id, email }, redirectUrl, res) => {
  const resetString = uuidv4() + _id;

  // first we clear all existing reset records
  PasswordReset.deleteMany({ userId: _id })
    .then((result) => {
      // Reset records cleared successfully
      // Now we send the email

      // mail options
      const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: 'Password Reset',
        html: `<p>We heard that you forgot your password.</p> <p>Don't worry, use the link below to reset it.</p><p>This link <b>expires in 60 minutes.</b></p>
        <p>Press <a href=${
          redirectUrl + '/' + _id + '/' + resetString
        }> here<a/> to proceed.</p>`,
      };
      // hash the reset string
      const saltRounds = 10;
      bcrypt
        .hash(resetString, saltRounds)
        .then((hashedResetString) => {
          // set values in password reset collection
          const newPasswordReset = new PasswordReset({
            userId: _id,
            resetString: hashedResetString,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000,
          });

          newPasswordReset
            .save()
            .then(() => {
              transporter
                .sendMail(mailOptions)
                .then(() => {
                  // reset email sent and password reset record saved
                  res.json({
                    status: 'PENDING',
                    message:
                      'Password reset email sent successfully. Please check your inbox.',
                  });
                })
                .catch((err) => {
                  console.log(err);
                  res.json({
                    status: 'FAILED',
                    message: 'Password reset email failed.',
                  });
                });
            })
            .catch((err) => {
              console.log(err);
              res.json({
                status: 'FAILED',
                message: 'Could not save password reset data!',
              });
            });
        })
        .catch((err) => {
          console.log(err);
          res.json({
            status: 'FAILED',
            message: 'An error occurred while hashing the reset string.',
          });
        });
    })
    .catch((err) => {
      // error while clearing existing records
      console.log(err);
      res.json({
        status: 'FAILED',
        message: 'Clearing existing password reset records failed.',
      });
    });
};

// Actually reset the password
router.post('/resetPassword', (req, res) => {
  let { userId, resetString, newPassword } = req.body;

  PasswordReset.find({ userId })
    .then((result) => {
      if (result.length > 0) {
        // password reset record exists

        const { expiresAt } = result[0];
        const hashedResetString = result[0].resetString;

        // check if the record has expired
        if (expiresAt < Date.now()) {
          PasswordReset.deleteOne({ userId })
            .then(() => {
              // Reset record deleted successfully
              res.json({
                status: 'FAILED',
                message: 'Password reset link has expired.',
              });
            })
            .catch((err) => {
              // deletion failed
              console.log(err);
              res.json({
                status: 'FAILED',
                message: 'Checking for existing password reset record failed.',
              });
            });
        } else {
          // valid record exists so we validate it
          // First compare the hashed reset string

          bcrypt
            .compare(resetString, hashedResetString)
            .then((result) => {
              if (result) {
                // strings match
                // hash password again

                const saltRounds = 10;
                bcrypt
                  .hash(newPassword, saltRounds)
                  .then((hashedNewPassword) => {
                    // update user password
                    User.updateOne(
                      { _id: userId },
                      { password: hashedNewPassword }
                    )
                      .then(() => {
                        // update completed. Now delete the password reset record

                        PasswordReset.deleteOne({ userId })
                          .then(() => {
                            // both user record and password reset record updated
                            res.json({
                              status: 'SUCCESS',
                              message: 'Password reset successfully.',
                            });
                          })
                          .catch((err) => {
                            res.json({
                              status: 'FAILED',
                              message:
                                'An error occurred while finalizing password reset.',
                            });
                          });
                      })
                      .catch((err) => {
                        res.json({
                          status: 'FAILED',
                          message: 'Updating user password failed.',
                        });
                      });
                  })
                  .catch((err) => {
                    res.json({
                      status: 'FAILED',
                      message:
                        'An error occurred while hashing the new password.',
                    });
                  });
              } else {
                res.json({
                  status: 'FAILED',
                  message: 'Invalid password reset details passed.',
                });
              }
            })
            .catch((err) => {
              console.log(err);
              res.json({
                status: 'FAILED',
                message: 'Comparing reset strings failed.',
              });
            });
        }
      } else {
        // Password reset record doesn't exist
        res.json({
          status: 'FAILED',
          message: 'No password reset record found',
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({
        status: 'FAILED',
        message: 'Checking for existing password reset record failed.',
      });
    });
});

module.exports = router;
