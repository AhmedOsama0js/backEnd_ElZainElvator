const express = require("express");
const router = express.Router();

const {
  getProjects,
  getProjectById,
  getProjectStats,
  getMonthlyProjectStats,
} = require("../../controllers/projects");

const { mongoIdValidator } = require("../../utils/validators/mongoIdValidator");
const { AuthUser, allowedTO } = require("../../controllers/authController");

router.use("/offer", require("./offer.routes"));
router.use("/contract", require("./contract.routes"));
router.use("/execution", require("./execution.routes"));
router.use("/archive", require("./archive.routes"));

router.get("/", AuthUser, allowedTO("moderator"), getProjects);
router.get(
  "/project-status",
  AuthUser,
  allowedTO("moderator"),
  getProjectStats
);
router.get(
  "/project-monthly-status",
  AuthUser,
  allowedTO("moderator"),
  getMonthlyProjectStats
);
router.get(
  "/:id",
  AuthUser,
  allowedTO("moderator"),
  mongoIdValidator,
  getProjectById
);

module.exports = router;
