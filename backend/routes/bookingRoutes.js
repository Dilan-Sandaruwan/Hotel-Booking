const express = require("express");
const bookingController = require("../controllers/bookingController");
const authOwner = require("../middleware/authOwner");

const router = express.Router();

// Create a new booking (called after payment confirmation — guest/user action)
router.post("/", bookingController.create);

// Get all bookings for a specific guest user (booking history page)
router.get("/user/:userId", bookingController.getByUser);

// Get all bookings for all hotels owned by an owner (owner dashboard)
router.get("/owner/:ownerId", authOwner, bookingController.getByOwner);

// Get a single booking by its UUID
router.get("/:id", bookingController.getById);

module.exports = router;
