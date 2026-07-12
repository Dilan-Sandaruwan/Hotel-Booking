const express = require("express");
const hotelController = require("../controllers/hotelController");
const authOwner = require("../middleware/authOwner");

const router = express.Router();

// Public routes — anyone can browse hotels
router.get("/", hotelController.getAll);
router.get("/:id", hotelController.getById);

// Protected routes — owner must be authenticated
router.post("/", authOwner, hotelController.create);
router.get("/owner/:ownerId", authOwner, hotelController.getOwnerHotels);

module.exports = router;
