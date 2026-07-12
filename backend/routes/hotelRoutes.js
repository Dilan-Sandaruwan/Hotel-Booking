const express = require("express");
const hotelController = require("../controllers/hotelController");

const router = express.Router();

router.post("/", hotelController.create);
router.get("/", hotelController.getAll);
router.get("/owner/:ownerId", hotelController.getOwnerHotels);
router.get("/:id", hotelController.getById);

module.exports = router;
