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
    enum: ['user', 'admin'],
    default: 'user',
  },
  bookmarks: [
    {
      bookmarkType: {
        type: String,
        enum: ['city', 'accommodation', 'tour'], // Add other types as needed
        required: true,
      },
      itemId: {
        type: Schema.Types.ObjectId, // Assuming your city/accommodation IDs are ObjectIds
        required: true,
      },
      itemId: {
        type: String, // Store as string to handle custom IDs
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review', // Assuming you'll have a Review model
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
