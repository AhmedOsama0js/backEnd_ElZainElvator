const express = require("express");
const router = express.Router();
const {
  updateContractPayments,
  convertContractToExecution,
} = require("../../controllers/projects");

const {
  paymentPercentagesValidator,
} = require("../../utils/validators/projectValidator");
const { mongoIdValidator } = require("../../utils/validators/mongoIdValidator");
const { AuthUser, allowedTO } = require("../../controllers/authController");
const checkProjectStatus = require("../../middleware/checkProjectStatus");

router.patch(
  "/:id",
  AuthUser,
  allowedTO("moderator"),
  mongoIdValidator,
  checkProjectStatus(["contract"]),
  paymentPercentagesValidator,
  updateContractPayments
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
