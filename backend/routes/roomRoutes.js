const express = require("express");
const roomController = require("../controllers/roomController");
const authOwner = require("../middleware/authOwner");

const router = express.Router();

// Public route — used by booking/hotel detail pages
router.get("/hotel/:hotelId", roomController.getHotelRooms);

// Protected routes — owner must be authenticated
router.post("/", authOwner, roomController.create);
router.put("/:id", authOwner, roomController.update);

module.exports = router;
