const express = require("express");
const router = express.Router();

const {
  completeContractAndArchive,
  toggleContractExecution,
  archiveStoppedContract,
} = require("../../controllers/projects");

const { mongoIdValidator } = require("../../utils/validators/mongoIdValidator");
const { AuthUser, allowedTO } = require("../../controllers/authController");
const checkProjectStatus = require("../../middleware/checkProjectStatus");

router.use(
  AuthUser,
  allowedTO("moderator"),
  checkProjectStatus(["execution"]),
  mongoIdValidator
);

router.patch("/complete-archive/:id", completeContractAndArchive);

router.patch("/toggle-execution/:id", toggleContractExecution);

router.patch("/archive-stopped/:id", archiveStoppedContract);

module.exports = router;
