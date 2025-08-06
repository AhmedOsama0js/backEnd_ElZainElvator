const express = require("express");
const router = express.Router();

const {
  completeContractAndArchive,
  toggleContractExecution,
  archiveStoppedContract,
  archiveActiveContract,
} = require("../../controllers/projects");

const { mongoIdValidator } = require("../../utils/validators/mongoIdValidator");
const { AuthUser, allowedTO } = require("../../controllers/authController");
const checkProjectStatus = require("../../middleware/checkProjectStatus");

router.patch(
  "/complete-archive/:id",
  AuthUser,
  allowedTO("moderator"),
  checkProjectStatus(["execution"]),
  mongoIdValidator,
  completeContractAndArchive
);

router.patch(
  "/toggle-execution/:id",
  AuthUser,
  allowedTO("moderator"),
  checkProjectStatus(["execution"]),
  mongoIdValidator,
  toggleContractExecution
);

router.patch(
  "/archive-stopped/:id",
  AuthUser,
  allowedTO("moderator"),
  checkProjectStatus(["execution"]),
  mongoIdValidator,
  archiveStoppedContract
);

router.patch(
  "/archive-active/:id",
  AuthUser,
  allowedTO("moderator"),
  checkProjectStatus(["archived"]),
  mongoIdValidator,
  archiveActiveContract
);

module.exports = router;
