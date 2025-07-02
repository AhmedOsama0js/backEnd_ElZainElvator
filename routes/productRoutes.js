const express = require("express");
const router = express.Router();
const checkProjectStatus = require("../middleware/checkProjectStatus");

const { AuthUser, allowedTO } = require("../controllers/authController");
const {
  createOffer,
  updateOffer,
  deleteOffer,
  convertOfferToContract,
  updateContract,
  convertContractToExecution,
  addExecutionStage,
  updateExecutionStage,
  deleteExecutionStage,
  getProjects,
  getProjectById,
  completeContractAndArchive,
  toggleContractExecution,
  archiveStoppedContract,
} = require("../controllers/productController");

const {
  offerValidator,
  updateOfferValidator,
  executionStageValidator,
  paymentPercentagesValidator,
} = require("../utils/validators/projectValidator");
const { mongoIdValidator } = require("../utils/validators/mongoIdValidator");

// *****************  ( main Fetcher ) *******************
router.get("/", AuthUser, allowedTO("moderator"), getProjects);
router.get(
  "/:id",
  AuthUser,
  allowedTO("moderator"),
  mongoIdValidator,
  getProjectById
);

router.patch(
  "/complete-archive/:id",
  AuthUser,
  allowedTO("moderator"),
  mongoIdValidator,
  completeContractAndArchive
);

router.patch(
  "/toggle-execution/:id",
  AuthUser,
  allowedTO("moderator"),
  mongoIdValidator,
  toggleContractExecution
);

router.patch(
  "/archive-stopped/:id",
  AuthUser,
  allowedTO("moderator"),
  mongoIdValidator,
  archiveStoppedContract
);

// ********************** (status = offer) ***************************
router.post(
  "/offer",
  AuthUser,
  allowedTO("moderator"),
  offerValidator,
  createOffer
);

router.put(
  "/offer/:id",
  AuthUser,
  allowedTO("moderator"),
  mongoIdValidator,
  checkProjectStatus(["offer"]),
  updateOfferValidator,
  updateOffer
);

router.delete(
  "/offer/:id",
  AuthUser,
  mongoIdValidator,
  allowedTO("moderator"),
  checkProjectStatus(["offer"]),
  deleteOffer
);

router.patch(
  "/convert-to-contract/:id",
  AuthUser,
  allowedTO("moderator"),
  mongoIdValidator,
  checkProjectStatus(["offer"]),
  convertOfferToContract
);

// ***************************** (status = contract) ****************************

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

// *****************************  (status = execution) ***************************
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
