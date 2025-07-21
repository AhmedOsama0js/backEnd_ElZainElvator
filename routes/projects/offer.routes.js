const express = require("express");
const router = express.Router();
const {
  createOffer,
  updateOffer,
  deleteOffer,
  convertOfferToContract,
} = require("../../controllers/projects");

const { offerValidator } = require("../../utils/validators/projectValidator");
const { mongoIdValidator } = require("../../utils/validators/mongoIdValidator");
const { AuthUser, allowedTO } = require("../../controllers/authController");
const checkProjectStatus = require("../../middleware/checkProjectStatus");

router.use(AuthUser, allowedTO("moderator"));

router.post("/", offerValidator, createOffer);

router.put(
  "/:id",
  mongoIdValidator,
  checkProjectStatus(["offer"]),
  offerValidator,
  updateOffer
);

router.delete(
  "/:id",
  mongoIdValidator,
  checkProjectStatus(["offer"]),
  deleteOffer
);

router.patch(
  "/convert-to-contract/:id",
  mongoIdValidator,
  checkProjectStatus(["offer"]),
  convertOfferToContract
);

module.exports = router;
