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

router.use(
  AuthUser,
  allowedTO("moderator"),
  mongoIdValidator,
  checkProjectStatus(["execution"])
);

router.post("/execution/:id", executionStageValidator, addExecutionStage);
router.put(
  "/execution/:id/stage/:stageId",
  executionStageValidator,
  updateExecutionStage
);
router.delete("/execution/:id/stage/:stageId", deleteExecutionStage);

module.exports = router;
