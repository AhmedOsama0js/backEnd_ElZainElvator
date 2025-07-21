const express = require("express");
const router = express.Router();
const {
  // deleteExecutionStage,
  // updateExecutionStage,
  addExecutionStageProduct,
  completeStages,
} = require("../../controllers/projects");

// const {
//   executionStageValidator,
// } = require("../../utils/validators/projectValidator");
const { mongoIdValidator } = require("../../utils/validators/mongoIdValidator");
const {
  validateStageParam,
} = require("../../utils/validators/stageKeyValidator");
const { AuthUser, allowedTO } = require("../../controllers/authController");
const checkProjectStatus = require("../../middleware/checkProjectStatus");

router.post(
  "/:id/stages/:stageKey",
  AuthUser,
  allowedTO("moderator"),
  mongoIdValidator,
  validateStageParam,
  checkProjectStatus(["execution"]),
  addExecutionStageProduct
);

router.patch(
  "/:id/stages/:stageKey",
  AuthUser,
  allowedTO("moderator"),
  mongoIdValidator,
  validateStageParam,
  checkProjectStatus(["execution"]),
  completeStages
);

// router.put(
//   "/:id/stage/:stageId",
//   AuthUser,
//   allowedTO("moderator"),
//   mongoIdValidator,
//   checkProjectStatus(["execution"]),
//   executionStageValidator,
//   updateExecutionStage
// );

// router.delete(
//   "/:id/stage/:stageId",
//   AuthUser,
//   allowedTO("moderator"),
//   mongoIdValidator,
//   checkProjectStatus(["execution"]),
//   deleteExecutionStage
// );

module.exports = router;
