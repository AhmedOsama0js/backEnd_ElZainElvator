const express = require("express");
const router = express.Router();
const {
  deleteExecutionStage,
  updateExecutionStage,
  addExecutionStage,
} = require("../../controllers/projects");

const {
  executionStageValidator,
} = require("../../utils/validators/projectValidator");
const { mongoIdValidator } = require("../../utils/validators/mongoIdValidator");
const { AuthUser, allowedTO } = require("../../controllers/authController");
const checkProjectStatus = require("../../middleware/checkProjectStatus");

router.post(
  "/execution/:id",
  AuthUser,
  allowedTO("moderator"),
  mongoIdValidator,
  checkProjectStatus(["execution"]),
  executionStageValidator,
  addExecutionStage
);
router.put(
  "/execution/:id/stage/:stageId",
  AuthUser,
  allowedTO("moderator"),
  mongoIdValidator,
  checkProjectStatus(["execution"]),
  executionStageValidator,
  updateExecutionStage
);
router.delete(
  "/execution/:id/stage/:stageId",
  AuthUser,
  allowedTO("moderator"),
  mongoIdValidator,
  checkProjectStatus(["execution"]),
  deleteExecutionStage
);

module.exports = router;
