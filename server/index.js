import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import GPSSimulator from "./simulator/gpsSimulator.js";

dotenv.config();

const app = express();

// ----------------------
// Middleware
// ----------------------
app.use(cors());
app.use(express.json());

// ----------------------
// Start Fake GPS Simulator
// ----------------------
const gps = new GPSSimulator();
gps.start();

// Save the latest GPS data here
let latestData = { location: { lat: null, lng: null }, stops: [] };

// Every time simulator sends new coordinates → update global variable
gps.on("locationUpdate", (data) => {
  latestData = data;
  console.log("📍 Simulated GPS:", data.location);
});

// ----------------------
// API ROUTES
// ----------------------

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

// Return latest GPS data
app.get("/api/gps", (req, res) => {
  res.json({
    success: true,
    location: latestData.location,
    stops: latestData.stops
  });
});

// Return the full route path for the map
app.get("/api/route", (req, res) => {
  res.json({
    success: true,
    routePath: latestData.routePath || []
  });
});

// ----------------------
// MongoDB Connection (optional)
// ----------------------
// Uncomment AFTER you create your DB
//
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB Connected"))
//   .catch((err) => console.log("MongoDB Error:", err));

// ----------------------
// Start Server
// ----------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
