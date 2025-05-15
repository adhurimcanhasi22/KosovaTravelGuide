const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccommodationSchema = new Schema({
  id: { type: String, required: true, unique: true }, // Use the ID from your JSON
  name: { type: String, required: true },
  image: String,
  location: String,
  type: String,
  price: Number,
  rating: Number,
  features: [String],
  // Add any other relevant fields
});

const Accommodation = mongoose.model('Accommodation', AccommodationSchema);
module.exports = Accommodation;
