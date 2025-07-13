const express = require("express");
const router = express.Router();
const {
  createOffer,
  updateOffer,
  deleteOffer,
  convertOfferToContract,
} = require("../../controllers/projects");

const {
  offerValidator,
  // updateOfferValidator,
} = require("../../utils/validators/projectValidator");
const { mongoIdValidator } = require("../../utils/validators/mongoIdValidator");
const { AuthUser, allowedTO } = require("../../controllers/authController");
const checkProjectStatus = require("../../middleware/checkProjectStatus");

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
  offerValidator,
  updateOffer
);

router.delete(
  "/offer/:id",
  AuthUser,
  allowedTO("moderator"),
  mongoIdValidator,
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

module.exports = router;
