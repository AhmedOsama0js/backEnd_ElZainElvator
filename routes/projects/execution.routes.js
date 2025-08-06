const express = require("express");
const router = express.Router();

const {
  addExecutionStageProduct,
  completeStages,
  AddAmountOfTheBondNumber,
} = require("../../controllers/projects");

const { mongoIdValidator } = require("../../utils/validators/mongoIdValidator");
const {
  validateStageParam,
} = require("../../utils/validators/stageKeyValidator");
const {
  addExecutionStageProductValidator,
  addBondValidation,
} = require("../../utils/validators/executionValidator");

const { AuthUser, allowedTO } = require("../../controllers/authController");
const checkProjectStatus = require("../../middleware/checkProjectStatus");

router.post(
  "/:id/stages/:stageKey",
  AuthUser,
  allowedTO("moderator"),
  mongoIdValidator,
  validateStageParam,
  addExecutionStageProductValidator,
  checkProjectStatus(["execution"]),
  addExecutionStageProduct
);

router.patch(
  "/:id/stages/:stageKey/bond",
  AuthUser,
  allowedTO("moderator"),
  mongoIdValidator,
  validateStageParam,
  addBondValidation,
  checkProjectStatus(["execution"]),
  AddAmountOfTheBondNumber
);

router.patch(
  "/:id/stages/:stageKey/complete",
  AuthUser,
  allowedTO("moderator"),
  mongoIdValidator,
  validateStageParam,
  checkProjectStatus(["execution"]),
  completeStages
);

module.exports = router;
