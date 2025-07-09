const express = require("express");
const router = express.Router();
const {
  updateContract,
  convertContractToExecution,
} = require("../../controllers/projects");

const {
  paymentPercentagesValidator,
} = require("../../utils/validators/projectValidator");
const { mongoIdValidator } = require("../../utils/validators/mongoIdValidator");
const { AuthUser, allowedTO } = require("../../controllers/authController");
const checkProjectStatus = require("../../middleware/checkProjectStatus");

router.patch(
  "/contract/:id",
  AuthUser,
  allowedTO("moderator"),
  mongoIdValidator,
  paymentPercentagesValidator,
  checkProjectStatus(["contract"]),
  updateContract
);

router.patch(
  "/convert-to-execution/:id",
  AuthUser,
  allowedTO("moderator"),
  mongoIdValidator,
  checkProjectStatus(["contract"]),
  convertContractToExecution
);

module.exports = router;
