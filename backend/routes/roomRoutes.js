const express = require("express");
const roomController = require("../controllers/roomController");

const router = express.Router();

router.post("/", roomController.create);
router.put("/:id", roomController.update);
router.get("/hotel/:hotelId", roomController.getHotelRooms);

module.exports = router;
