const express = require("express");
const router = express.Router();

const { sendMessage } = require("../controllers/teamMessageController");

// const { updateUserValidator } = require("../utils/validators/userValidator");

// team Message Routes
router.post("/", sendMessage);

module.exports = router;
