const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CitySchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  region: String,
  image: String,
  description: String,
  longDescription: String,
  coordinates: {
    lat: Number,
    lng: Number,
  },
  attributes: [String],
  thingsToDo: [
    {
      name: String,
      description: String,
    },
  ],
  images: [String],
  // Add any other relevant fields
});

const City = mongoose.model('City', CitySchema);
module.exports = City;
