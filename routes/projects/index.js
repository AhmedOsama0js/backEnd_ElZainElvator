const express = require("express");
const router = express.Router();

router.use(require("./offer.routes"));
router.use(require("./contract.routes"));
router.use(require("./execution.routes"));
router.use(require("./archive.routes"));

const {
  getProjects,
  getProjectById,
  getProjectStats,
  getMonthlyProjectStats,
} = require("../../controllers/projects");

const { mongoIdValidator } = require("../../utils/validators/mongoIdValidator");
const { AuthUser, allowedTO } = require("../../controllers/authController");

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
