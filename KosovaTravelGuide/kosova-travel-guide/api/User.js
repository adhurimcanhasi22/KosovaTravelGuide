const express = require('express');
const router = express.Router();

//mongodb user model
const User = require('./../models/User');

// password handler
const bcrypt = require('bcrypt');
const { data } = require('autoprefixer');

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
              });

              newUser
                .save()
                .then((result) => {
                  res.json({
                    status: 'SUCCESS',
                    message: 'User created successfully',
                    data: result,
                  });
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
                //Password not    matched
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
