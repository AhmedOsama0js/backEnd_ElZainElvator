const express = require("express");
const router = express.Router();

const { AuthUser, allowedTO } = require("../controllers/authController");
const { addRecord, updateRecord } = require("../controllers/userController");

const {
  updateUserValidator,
  addUserValidator,
} = require("../utils/validators/userValidator");

// User Routes
router.post("/", AuthUser, allowedTO("moderator"), addUserValidator, addRecord);
router.put(
  "/:id",
  AuthUser,
  allowedTO("moderator"),
  updateUserValidator,
  updateRecord
);

module.exports = router;
