const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TravelTipSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true, // Ensure each travel tip has a unique ID
    },
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    list: {
      type: [String], // Array of strings
      default: [], // Default to an empty array if not provided
    },
  },
  { timestamps: true }
); // Adds createdAt and updatedAt timestamps

const TravelTip = mongoose.model('TravelTip', TravelTipSchema);
module.exports = TravelTip;
