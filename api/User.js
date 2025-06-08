const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { protect } = require('../middleware/authMiddleware');

//mongodb user model
const User = require('./../models/User');

//mongodb user verification model
const UserVerification = require('./../models/UserVerification');

//mongodb password reset model
const PasswordReset = require('./../models/PasswordReset');

//mongodb City model
const City = require('../models/City');

//mongodb Accommodation model
const Accommodation = require('../models/Accommodation');

//mongodb Tour model
const Tour = require('../models/Tour');

//mongodb TravelPlan model
const TravelPlan = require('../models/TravelPlan');

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
    { userId: user._id, email: user.email, role: user.role }, // Include role here
    process.env.JWT_SECRET,
    { expiresIn: '6h' }
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
  const currentUrl = 'https://kosovatravelguide.onrender.com/';

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
                    `https://kosovatravelguidetest.netlify.app/verified-error?message=${message}`
                  );
                })
                .catch((error) => {
                  let message =
                    'Clearing user with expired unique string failed';
                  res.redirect(
                    `https://kosovatravelguidetest.netlify.app/verified-error?message=${message}`
                  );
                });
            })
            .catch((error) => {
              console.log(error);
              let message =
                'An error occurred while clearing expired user verification record.';
              res.redirect(
                `https://kosovatravelguidetest.netlify.app/verified-error?message=${message}`
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
                        res.redirect(
                          `https://kosovatravelguidetest.netlify.app/verified-success`
                        );
                      })
                      .catch((error) => {
                        console.log(error);
                        let message =
                          'An error occurred while finalizing successful verification.';
                        res.redirect(
                          `https://kosovatravelguidetest.netlify.app/verified-error?message=${message}`
                        );
                      });
                  })
                  .catch((error) => {
                    console.log(error);
                    let message =
                      'An error occurred while updating user record.';
                    res.redirect(
                      `https://kosovatravelguidetest.netlify.app/verified-error?message=${message}`
                    );
                  });
              } else {
                // exisitng record but incorrect verification details passed
                let message =
                  'Invalid verification details passed. Check your inbox.';
                res.redirect(
                  `https://kosovatravelguidetest.netlify.app/verified-error?message=${message}`
                );
              }
            })
            .catch((error) => {
              let message = 'An error occurred while comparing unique strings.';
              res.redirect(
                `https://kosovatravelguidetest.netlify.app/verified-error?message=${message}`
              );
            });
        }
      } else {
        // user verification doesn't exist
        let message =
          'Account record doesn/t exist or has been verified already. Please log in. ';
        res.redirect(
          `https://kosovatravelguidetest.netlify.app/verified-error?message=${message}`
        );
      }
    })
    .catch((error) => {
      console.log(error);
      let message =
        'An error occurred while checking for exisiting user verification record';
      res.redirect(
        `https://kosovatravelguidetest.netlify.app/verified-error?message=${message}`
      );
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
                  // Password matched, generate JWT
                  const user = data[0]; // Get the user object
                  const token = generateToken(user);

                  // Send the token in the response body
                  res.json({
                    status: 'SUCCESS',
                    message: 'User signed in successfully',
                    token: token, // Add the token here
                    data: {
                      // Send back necessary user data (excluding password)
                      id: user._id,
                      email: user.email,
                      name: user.name,
                      reviews: user.reviews,
                      bookmarks: user.bookmarks,
                      // Add any other non-sensitive fields the frontend might need
                    },
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

// Logout
router.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
});

// Protected Route (Dashboard)
router.get('/dashboard', protect, (req, res) => {
  res.status(200).json({
    message: 'Welcome to the dashboard!',
    user: req.user,
  });
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

// --- Protected Route to Get User Profile Data ---
router.get('/profile', protect, async (req, res) => {
  try {
    // req.user is attached by the 'protect' middleware and contains the token payload { userId, email }
    const userId = req.user.userId;

    // Find the user by ID and select fields (exclude password)
    // Populate reviews and bookmarks - adjust 'ref' names ('Place', 'Review') if different in your models
    const user = await User.findById(userId).select('-password'); // Exclude password field
    // Remove populate for now if Review/Place models don't exist or cause issues
    // .populate('reviews') // Populate the reviews array
    // .populate('bookmarks'); // Populate the bookmarks array

    if (!user) {
      return res
        .status(404)
        .json({ status: 'FAILED', message: 'User not found' });
    }

    res.json({ status: 'SUCCESS', data: user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res
      .status(500)
      .json({ status: 'FAILED', message: 'Server error fetching profile' });
  }
});

// --- Protected Route to Update User Profile Data ---
router.put('/profile', protect, async (req, res) => {
  try {
    const userId = req.user.userId; // Get userId from authenticated token
    const { name, email } = req.body; // Get new name/email from request body

    // Basic validation
    if (
      (name !== undefined && typeof name !== 'string') ||
      name.trim() === ''
    ) {
      return res
        .status(400)
        .json({ status: 'FAILED', message: 'Invalid name provided' });
    }
    if (
      email !== undefined &&
      (typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email.trim()))
    ) {
      return res
        .status(400)
        .json({ status: 'FAILED', message: 'Invalid email format provided' });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (email !== undefined) updateData.email = email.trim().toLowerCase(); // Store emails consistently

    // If email is being updated, check if it already exists for another user
    if (updateData.email) {
      const existingUser = await User.findOne({
        email: updateData.email,
        _id: { $ne: userId }, // Check for users other than the current one
      });
      if (existingUser) {
        return res.status(400).json({
          status: 'FAILED',
          message: 'Email already in use by another account',
        });
      }
    }

    // Find user by ID and update with new data
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true } // Return the updated doc, run schema validators
    ).select('-password'); // Exclude password from the returned object

    if (!updatedUser) {
      return res
        .status(404)
        .json({ status: 'FAILED', message: 'User not found during update' });
    }

    // Optionally: If email was changed, you might want to mark it as unverified again
    // and trigger the verification email process (more complex setup)
    // For now, we'll just update it.

    res.json({
      status: 'SUCCESS',
      message: 'Profile updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    // Handle potential validation errors from Mongoose
    if (error.name === 'ValidationError') {
      return res.status(400).json({ status: 'FAILED', message: error.message });
    }
    res
      .status(500)
      .json({ status: 'FAILED', message: 'Server error updating profile' });
  }
});

// --- Protected Route to Get User Bookmarks (Revised to fetch full data for display) ---
router.get('/bookmarks', protect, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select('bookmarks');
    if (!user) {
      return res
        .status(404)
        .json({ status: 'FAILED', message: 'User not found' });
    }

    const populatedBookmarks = await Promise.all(
      user.bookmarks.map(async (bookmark) => {
        let item = null;
        let bookmarkData = { ...bookmark.toObject() }; // Start with existing bookmark data

        if (bookmark.bookmarkType === 'city') {
          item = await City.findById(bookmark.itemId).select(
            'name slug image description'
          );
          if (item) {
            bookmarkData = {
              ...bookmarkData,
              name: item.name,
              slug: item.slug,
              image: item.image,
              description: item.description,
              route: `/destinations/${item.slug}`,
              type: 'destination', // Use 'destination' for frontend rendering
            };
          }
        } else if (bookmark.bookmarkType === 'accommodation') {
          item = await Accommodation.findOne({ id: bookmark.itemId }).select(
            'name image price type location rating'
          );
          if (item) {
            bookmarkData = {
              ...bookmarkData,
              name: item.name,
              image: item.image,
              price: item.price,
              type: item.type, // E.g., 'Hotel', 'Guesthouse'
              location: item.location,
              rating: item.rating,
              route: `/accommodations/${bookmark.itemId}`,
              type: 'accommodation',
            };
          }
        } else if (bookmark.bookmarkType === 'tour') {
          // Assuming Tour model exists and is imported, and has an 'id' field
          item = await Tour.findOne({ id: bookmark.itemId }).select(
            'name image price duration groupSize location description'
          );
          if (item) {
            bookmarkData = {
              ...bookmarkData,
              name: item.name,
              image: item.image,
              price: item.price,
              duration: item.duration,
              groupSize: item.groupSize,
              location: item.location,
              description: item.description,
              route: `/tours/${bookmark.itemId}`, // Assuming tours have a unique string ID for their detail page
              type: 'tour',
            };
          }
        }
        // If item is not found or type is unknown, return basic bookmark data
        return bookmarkData;
      })
    );

    // Filter out bookmarks where the associated item was not found (optional, but good for cleanup)
    const validPopulatedBookmarks = populatedBookmarks.filter(
      (item) => item.name
    );

    res.json({ status: 'SUCCESS', data: validPopulatedBookmarks });
  } catch (error) {
    console.error('Error fetching user bookmarks:', error);
    res
      .status(500)
      .json({ status: 'FAILED', message: 'Server error fetching bookmarks' });
  }
});

// --- Protected Route to Add a Bookmark ---
router.post('/bookmarks/add', protect, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { bookmarkType, itemId } = req.body;

    if (!bookmarkType || !itemId) {
      return res
        .status(400)
        .json({ status: 'FAILED', message: 'Missing bookmarkType or itemId' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ status: 'FAILED', message: 'User not found' });
    }

    // Check if the item exists in the respective collection
    let itemExists = false;
    if (bookmarkType === 'city') {
      itemExists = await City.exists({ _id: itemId }); // Assuming itemId is ObjectId for cities
    } else if (bookmarkType === 'accommodation') {
      itemExists = await Accommodation.exists({ id: itemId }); // Assuming itemId is string ID for accommodations
    } else if (bookmarkType === 'tour') {
      // Added tour check
      itemExists = await Tour.exists({ id: itemId }); // Assuming itemId is string ID for tours
    } else {
      return res
        .status(400)
        .json({ status: 'FAILED', message: 'Invalid bookmarkType' });
    }

    if (!itemExists) {
      return res.status(404).json({
        status: 'FAILED',
        message: `${bookmarkType} with ID ${itemId} not found`,
      });
    }

    // Check if the item is already bookmarked
    const alreadyBookmarked = user.bookmarks.some(
      (bookmark) =>
        bookmark.bookmarkType === bookmarkType &&
        bookmark.itemId.toString() === itemId
    );

    if (!alreadyBookmarked) {
      user.bookmarks.push({ bookmarkType, itemId });
      await user.save();
      res.status(200).json({ status: 'SUCCESS', message: 'Bookmark added' });
    } else {
      res
        .status(200)
        .json({ status: 'SUCCESS', message: 'Item already bookmarked' });
    }
  } catch (error) {
    console.error('Error adding bookmark:', error);
    res
      .status(500)
      .json({ status: 'FAILED', message: 'Server error adding bookmark' });
  }
});

// --- Protected Route to Remove a Bookmark ---
router.delete('/bookmarks/remove', protect, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { bookmarkType, itemId } = req.body;

    console.log(
      `[Bookmark Remove] Received: bookmarkType=${bookmarkType}, itemId=${itemId}, userId=${userId}`
    );

    if (!bookmarkType || !itemId) {
      return res
        .status(400)
        .json({ status: 'FAILED', message: 'Missing bookmarkType or itemId' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ status: 'FAILED', message: 'User not found' });
    }

    // Filter out the bookmark to be removed
    const initialBookmarkCount = user.bookmarks.length;
    user.bookmarks = user.bookmarks.filter(
      (bookmark) =>
        !(
          bookmark.bookmarkType === bookmarkType &&
          bookmark.itemId.toString() === itemId.toString()
        )
    );

    if (user.bookmarks.length === initialBookmarkCount) {
      // If the count hasn't changed, it means the item wasn't found to remove
      console.log(
        `[Bookmark Remove] Item not found in user's bookmarks: ${bookmarkType} - ${itemId} for user ${userId}`
      );
      return res.status(404).json({
        status: 'FAILED',
        message: 'Bookmark not found for this user.',
      });
    }

    await user.save();
    console.log(
      `[Bookmark Remove] Bookmark removed: ${bookmarkType} - ${itemId} for user ${userId}`
    );
    res.status(200).json({ status: 'SUCCESS', message: 'Bookmark removed' });
  } catch (error) {
    console.error('[Bookmark Remove] Error removing bookmark:', error);
    res
      .status(500)
      .json({ status: 'FAILED', message: 'Server error removing bookmark' });
  }
});

// --- Contact Form Submission Route (now handles custom tour data) ---
router.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body; // 'message' will now contain the formatted HTML from frontend

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({
      status: 'FAILED',
      message: 'Name, email, and message are required fields.',
    });
  }

  // Email format validation
  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    return res.status(400).json({
      status: 'FAILED',
      message: 'Invalid email format.',
    });
  }

  try {
    const mailOptions = {
      from: `"${name}" <${email}>`, // Sender's name and email from the form
      to: process.env.RECIPIENT_EMAIL, // Your email address where you want to receive messages
      subject: subject || 'No Subject', // Use the subject sent from the frontend
      html: message, // Use the HTML message sent from the frontend
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      status: 'SUCCESS',
      message: 'Your message has been sent successfully!',
    });
  } catch (error) {
    console.error('Error sending contact email:', error);
    res.status(500).json({
      status: 'FAILED',
      message: 'Failed to send message. Please try again later.',
      error: error.message,
    });
  }
});

// Define the default checklist items for a new travel plan
const defaultChecklistItems = [
  {
    id: 'documents-passport-expiry',
    label: 'Check passport/ID expiry and validity',
    category: 'Documents',
    isCompleted: false,
  },
  {
    id: 'documents-visa-requirements',
    label: 'Research visa requirements for Kosovo',
    category: 'Documents',
    isCompleted: false,
  },
  {
    id: 'documents-travel-insurance',
    label: 'Arrange travel insurance',
    category: 'Documents',
    isCompleted: false,
  },
  {
    id: 'packing-essentials-summer',
    label: 'Pack light clothing, swimwear (Summer: June-Sept)',
    category: 'Packing',
    isCompleted: false,
  },
  {
    id: 'packing-essentials-autumn',
    label: 'Pack layers, light jacket (Autumn: Oct-Nov)',
    category: 'Packing',
    isCompleted: false,
  },
  {
    id: 'packing-essentials-winter',
    label: 'Pack warm clothing, heavy coat, snow boots (Winter: Dec-Mar)',
    category: 'Packing',
    isCompleted: false,
  },
  {
    id: 'packing-essentials-spring',
    label: 'Pack light layers, umbrella (Spring: Apr-May)',
    category: 'Packing',
    isCompleted: false,
  },
  {
    id: 'health-vaccinations',
    label: 'Check recommended vaccinations',
    category: 'Health',
    isCompleted: false,
  },
  {
    id: 'health-medication',
    label: 'Prepare essential personal medication',
    category: 'Health',
    isCompleted: false,
  },
  {
    id: 'transportation-flights',
    label: 'Book flights to Kosovo',
    category: 'Transportation',
    isCompleted: false,
  },
  {
    id: 'transportation-local',
    label: 'Plan local transportation (car rental/taxis)',
    category: 'Transportation',
    isCompleted: false,
  },
  {
    id: 'itinerary-tours',
    label: 'Consider booking a planned tour from our list',
    category: 'Itinerary',
    isCompleted: false,
  },
  {
    id: 'itinerary-destinations-accommodation',
    label: 'Choose destinations and book accommodation',
    category: 'Itinerary',
    isCompleted: false,
  },
  {
    id: 'finance-currency',
    label: 'Familiarize with local currency (Euro)',
    category: 'Finance',
    isCompleted: false,
  },
  {
    id: 'finance-budget',
    label: 'Set a daily budget for the trip',
    category: 'Finance',
    isCompleted: false,
  },
  {
    id: 'communication-sim-card',
    label: 'Consider local SIM card or roaming plan',
    category: 'Communication',
    isCompleted: false,
  },
  {
    id: 'communication-emergency-contacts',
    label: 'Save emergency contacts and embassy details',
    category: 'Communication',
    isCompleted: false,
  },
];

// Helper function to calculate progress percentage
const calculateProgress = (checklist) => {
  if (!checklist || checklist.length === 0) {
    return 0;
  }
  const completedItems = checklist.filter((item) => item.isCompleted).length;
  return Math.round((completedItems / checklist.length) * 100);
};

// @desc    Get user's travel plan or create a new one if none exists
// @route   GET /user/travelplan
// @access  Private
router.get('/travelplan', protect, async (req, res) => {
  try {
    const userId = req.user.userId;
    let travelPlan = await TravelPlan.findOne({ userId });

    if (!travelPlan) {
      // If no plan exists, create a new one with default items
      travelPlan = new TravelPlan({
        userId,
        checklist: defaultChecklistItems.map((item) => ({
          id: item.id,
          isCompleted: item.isCompleted,
        })),
      });
      await travelPlan.save();
    }

    const progressPercentage = calculateProgress(travelPlan.checklist);

    res.status(200).json({
      status: 'SUCCESS',
      message: 'Travel plan fetched successfully',
      data: {
        ...travelPlan.toObject(),
        progressPercentage,
      },
    });
  } catch (error) {
    console.error('Error fetching/creating travel plan:', error);
    res.status(500).json({
      status: 'FAILED',
      message: 'Server error fetching or creating travel plan',
    });
  }
});

// @desc    Update the completion status of a checklist item in the travel plan
// @route   PUT /user/travelplan/:itemId
// @access  Private
router.put('/travelplan/:itemId', protect, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { itemId } = req.params;
    const { isCompleted } = req.body;

    if (typeof isCompleted !== 'boolean') {
      return res.status(400).json({
        status: 'FAILED',
        message: 'Invalid isCompleted status provided.',
      });
    }

    const travelPlan = await TravelPlan.findOne({ userId });

    if (!travelPlan) {
      return res.status(404).json({
        status: 'FAILED',
        message: 'Travel plan not found for this user.',
      });
    }

    // Find the item and update its status
    const itemIndex = travelPlan.checklist.findIndex(
      (item) => item.id === itemId
    );

    if (itemIndex > -1) {
      travelPlan.checklist[itemIndex].isCompleted = isCompleted;
      travelPlan.markModified('checklist'); // Mark the array as modified for Mongoose to save changes
      await travelPlan.save();
    } else {
      // If the item doesn't exist, we might want to add it or return an error
      // For now, let's return an error if it's not found in the existing checklist
      return res.status(404).json({
        status: 'FAILED',
        message: `Checklist item with ID ${itemId} not found.`,
      });
    }

    const progressPercentage = calculateProgress(travelPlan.checklist);

    res.status(200).json({
      status: 'SUCCESS',
      message: 'Travel plan updated successfully',
      data: {
        ...travelPlan.toObject(),
        progressPercentage,
      },
    });
  } catch (error) {
    console.error('Error updating travel plan item:', error);
    res
      .status(500)
      .json({ status: 'FAILED', message: 'Server error updating travel plan' });
  }
});

// @desc    Delete the user's travel plan (resets it)
// @route   DELETE /user/travelplan
// @access  Private
router.delete('/travelplan', protect, async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await TravelPlan.deleteOne({ userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        status: 'FAILED',
        message: 'No travel plan found to delete for this user.',
      });
    }

    res.status(200).json({
      status: 'SUCCESS',
      message:
        'Travel plan deleted successfully. A new plan will be created upon next access.',
    });
  } catch (error) {
    console.error('Error deleting travel plan:', error);
    res
      .status(500)
      .json({ status: 'FAILED', message: 'Server error deleting travel plan' });
  }
});

module.exports = router;
