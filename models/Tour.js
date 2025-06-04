const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TourSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: String,
  duration: { type: String, required: true },
  groupSize: { type: Number, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  location: String,
  highlights: {
    type: [String],
    default: [],
  },
});

const Tour = mongoose.model('Tour', TourSchema);
module.exports = Tour;
