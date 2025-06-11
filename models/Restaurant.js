const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RestaurantSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false, // Image is optional, consistent with Accommodation
  },
  location: {
    type: String,
    required: true, // E.g., "Prishtina", "Prizren", or a specific neighborhood
  },
  type: {
    type: String,
    required: true,
    // Examples: 'restaurant', 'cafe', 'bar', 'bakery', 'street food', 'pizzeria', 'fine dining'
  },
  cuisine: {
    type: String,
    required: false, // E.g., 'Albanian', 'Italian', 'Balkan', 'Fast Food', 'Coffee Shop'
  },
  priceRange: {
    type: String,
    required: false, // E.g., '€', '€€', '€€€' for affordability
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    required: false, // Rating is optional
  },
  description: {
    type: String,
    required: true, // A brief description of the place
  },
  tripadvisorUrl: {
    // NEW FIELD: TripAdvisor URL
    type: String,
    required: false, // Make it optional
  },
});

const Restaurant = mongoose.model('Restaurant', RestaurantSchema);

module.exports = Restaurant;
