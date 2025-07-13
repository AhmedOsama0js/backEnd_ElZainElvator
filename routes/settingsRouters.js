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
  validateStageParam,
  validateProductParam,
  validateProductBody,
} = require("../utils/validators/settingValidator");

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
  "/:stageKey/update/:productId",
  AuthUser,
  allowedTO("moderator"),
  validateStageParam,
  validateProductParam,
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
