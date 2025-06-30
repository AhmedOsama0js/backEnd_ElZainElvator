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
} = require("../controllers/productController");

router.get("/", AuthUser, allowedTO("moderator"), getProjects);
router.get("/:id");

// (status = offer)
router.post("/offer", AuthUser, allowedTO("moderator"), createOffer);
router.put(
  "/offer/:id",
  AuthUser,
  allowedTO("moderator"),
  checkProjectStatus(["offer"]),
  updateOffer
);

router.delete(
  "/offer/:id",
  AuthUser,
  allowedTO("moderator"),
  checkProjectStatus(["offer"]),
  deleteOffer
);

router.patch(
  "/convert-to-contract/:id",
  AuthUser,
  allowedTO("moderator"),
  checkProjectStatus(["offer"]),
  convertOfferToContract
);

// (status = contract)

router.patch(
  "/contract/:id",
  AuthUser,
  allowedTO("moderator"),
  checkProjectStatus(["contract"]),
  updateContract
);

router.patch(
  "/convert-to-execution/:id",
  AuthUser,
  allowedTO("moderator"),
  checkProjectStatus(["contract"]),
  convertContractToExecution
);

// (status = execution)
router.post(
  "/execution/:id",
  AuthUser,
  allowedTO("moderator"),
  checkProjectStatus(["execution"]),
  addExecutionStage
);
router.put(
  "/execution/:id/stage/:stageId",
  AuthUser,
  allowedTO("moderator"),
  checkProjectStatus(["execution"]),
  updateExecutionStage
);
router.delete(
  "/execution/:id/stage/:stageId",
  AuthUser,
  allowedTO("moderator"),
  checkProjectStatus(["execution"]),
  deleteExecutionStage
);

module.exports = router;
