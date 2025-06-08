const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChecklistItemSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const TravelPlanSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    default: 'My Kosova Trip Plan',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  checklist: [ChecklistItemSchema],
});

TravelPlanSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const TravelPlan = mongoose.model('TravelPlan', TravelPlanSchema);
module.exports = TravelPlan;
