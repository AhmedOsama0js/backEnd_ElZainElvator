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

router.use(AuthUser, allowedTO("moderator"));

router.get("/", getAllSettings);

router.post(
  "/:stageKey",
  validateStageParam,
  validateProductBody,
  addProductToStage
);
router.put(
  "/:stageKey/update/:productId",
  validateStageParam,
  validateProductParam,
  validateProductBody,
  updateProductInStage
);
router.delete(
  "/:stageKey/delete/:productId",
  validateStageParam,
  validateProductParam,
  deleteProductFromStage
);

module.exports = router;
