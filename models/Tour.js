const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TourSchema = new Schema({
  id: { type: String, required: true, unique: true }, // Added id field, required and unique
  name: { type: String, required: true },
  image: String,
  duration: { type: String, required: true },
  groupSize: { type: Number, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  // You can add more fields as needed, e.g.,
  // itinerary: [String],
  // included: [String],
  // excluded: [String],
  // location: String, // You might want to specify a location
});

const Tour = mongoose.model('Tour', TourSchema);
module.exports = Tour;
