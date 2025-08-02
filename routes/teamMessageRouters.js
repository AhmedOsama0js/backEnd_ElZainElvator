const express = require("express");
const router = express.Router();

const { sendMessage } = require("../controllers/teamMessageController");

// team Message Routes
router.post("/", sendMessage);

module.exports = router;
