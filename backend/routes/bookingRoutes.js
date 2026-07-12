const express = require("express");
const bookingController = require("../controllers/bookingController");

const router = express.Router();

// Create a new booking (called after payment confirmation)
router.post("/", bookingController.create);

// Get all bookings for a specific user (booking history)
router.get("/user/:userId", bookingController.getByUser);

// Get a single booking by its UUID
router.get("/:id", bookingController.getById);

module.exports = router;
