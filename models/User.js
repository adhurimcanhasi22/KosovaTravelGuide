const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'], // Can be 'user' or 'admin'
    default: 'user',
  },
  bookmarks: [
    {
      type: Schema.Types.ObjectId, // You can reference the Place model (for example)
      ref: 'Place', // Assuming you have a Place model
    },
  ],
  reviews: [
    {
      type: Schema.Types.ObjectId, // You can reference the Review model (for example)
      ref: 'Review', // Assuming you have a Review model
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  verified: Boolean,
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
