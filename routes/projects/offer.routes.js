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

router.post("/offer", offerValidator, createOffer);

router.use(mongoIdValidator, checkProjectStatus(["offer"]));

router.put("/offer/:id", offerValidator, updateOffer);

router.delete("/offer/:id", deleteOffer);

router.patch("/convert-to-contract/:id", convertOfferToContract);

module.exports = router;
