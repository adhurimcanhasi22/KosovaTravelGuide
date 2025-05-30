const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccommodationSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: { type: String, required: false }, // Image is optional
  location: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, min: 0, max: 5 },
  features: { type: [String], default: [] }, // Array of strings for features
  bookingUrl: { type: String, required: false }, // New field for booking URL
});

const Accommodation = mongoose.model('Accommodation', AccommodationSchema);
module.exports = Accommodation;
