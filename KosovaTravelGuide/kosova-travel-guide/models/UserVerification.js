const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserVerificationSchema = new Schema({
  userId: String,
  uniqueString: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: Date,
});

const UserVerification = mongoose.model(
  'UserVerification',
  UserVerificationSchema
);
module.exports = UserVerification;
