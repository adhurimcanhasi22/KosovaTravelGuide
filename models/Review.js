const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  // Reference to the user who submitted the review
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Reference to the item being reviewed (accommodation, destination, restaurant, tour)
  itemId: {
    type: String, // Stored as string to accommodate custom string IDs (acc, tour, restaurant) and ObjectId strings (city)
    required: true,
  },
  // Type of item being reviewed (for easy lookup/categorization)
  itemType: {
    type: String,
    enum: ['city', 'accommodation', 'tour', 'restaurant'],
    required: true,
  },
  // User's name at the time of submission (optional, can be populated from User if needed, but useful for logs)
  userName: {
    type: String,
    required: true,
  },
  // Main subject/title of the review (for dashboard summary)
  subject: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100, // Limit subject length
  },
  // Detailed text message of the review
  message: {
    type: String,
    required: true,
  },
  // Checkbox options/reasons for the review (e.g., 'Positive Experience', 'Issue Encountered')
  // This will be an array of strings representing selected checkboxes
  reasons: {
    type: [String],
    default: [],
  },
  // Optional: A numerical rating if you want to include it in the future for internal use
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: false,
  },
  // Timestamp for when the review was submitted
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  // Status for internal moderation (e.g., 'pending', 'approved', 'rejected')
  // Not directly used by the user dashboard in this version, but good for admin
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
});

const Review = mongoose.model('Review', ReviewSchema);
module.exports = Review;
