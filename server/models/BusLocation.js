// server/models/BusLocation.js
import mongoose from "mongoose";

const BusLocationSchema = new mongoose.Schema({
  busId: {
    type: String,
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Unique index so findOneAndUpdate with upsert keeps one doc per busId
BusLocationSchema.index({ busId: 1 }, { unique: true });

export const BusLocation = mongoose.model("BusLocation", BusLocationSchema);
