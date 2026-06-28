// routes/location.js
import express from "express";
import Location from "../models/Location.js";

const router = express.Router();

// -----------------------------
// POST — Update GPS from ESP32
// -----------------------------
router.post("/update", async (req, res) => {
  try {
    const { busId, latitude, longitude } = req.body;

    if (!busId || !latitude || !longitude) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const locationData = await Location.findOneAndUpdate(
      { busId },
      { latitude, longitude, updatedAt: new Date() },
      { new: true, upsert: true }
    );

    res.json({ success: true, location: locationData });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

// ----------------------------------
// GET — Fetch Latest Bus Coordinates
// ----------------------------------
router.get("/:busId", async (req, res) => {
  try {
    const busId = req.params.busId;
    const location = await Location.findOne({ busId });

    if (!location) {
      return res.json({
        success: false,
        message: "No GPS data found for this bus yet.",
      });
    }

    res.json({
      success: true,
      latitude: location.latitude,
      longitude: location.longitude,
      updatedAt: location.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

export default router;
