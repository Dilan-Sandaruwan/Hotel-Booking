const express = require("express");
const ownerController = require("../controllers/ownerController");

const router = express.Router();

router.post("/register", ownerController.register);
router.post("/login", ownerController.login);

module.exports = router;
