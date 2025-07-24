const express = require("express");
const router = express.Router();

const { AuthUser, allowedTO } = require("../controllers/authController");
const {
  addProductToStage,
  updateProductInStage,
  deleteProductFromStage,
  getAllSettings,
} = require("../controllers/settingController");

const {
  validateProductParam,
  validateProductBody,
} = require("../utils/validators/settingValidator");
const { validateStageParam } = require("../utils/validators/stageKeyValidator");

// setting Routes
router.get("/", AuthUser, allowedTO("moderator"), getAllSettings);

router.post(
  "/:stageKey",
  AuthUser,
  allowedTO("moderator"),
  validateStageParam,
  validateProductBody,
  addProductToStage
);
router.put(
  "/:stageKey/update",
  AuthUser,
  allowedTO("moderator"),
  validateStageParam,
  validateProductBody,
  updateProductInStage
);

router.delete(
  "/:stageKey/delete/:productId",
  AuthUser,
  allowedTO("moderator"),
  validateStageParam,
  validateProductParam,
  deleteProductFromStage
);

module.exports = router;
