import express from "express";

const router = express.Router();

// The index.js will inject latestLocation here
let locationStore = {
  lat: null,
  lng: null,
};

// This function will be called from index.js
export function updateLocation(coords) {
  locationStore = coords;
}

// GET latest GPS location
router.get("/", (req, res) => {
  res.json({
    success: true,
    location: locationStore,
  });
});

export default router;
