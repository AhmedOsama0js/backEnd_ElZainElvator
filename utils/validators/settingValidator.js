const { body, param } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

const validStages = ["stage1Products", "stage2Products", "stage3Products"];

// ✅ للتحقق من stageKey في params
exports.validateStageParam = [
  param("stageKey")
    .notEmpty()
    .withMessage("⚠️ اسم المرحلة مطلوب")
    .isIn(validStages)
    .withMessage("⚠️ اسم المرحلة غير صحيح"),
  validatorMiddleware,
];

exports.validateProductParam = [
  param("productId")
    .notEmpty()
    .withMessage("⚠️ رقم المنتج مطلوب")
    .isMongoId()
    .withMessage("⚠️ رقم المنتج غير صالح"),
  validatorMiddleware,
];

// ✅ للتحقق من body عند الإضافة أو التعديل
exports.validateProductBody = [
  body("product")
    .notEmpty()
    .withMessage("⚠️ المنتج مطلوب")
    .isMongoId()
    .withMessage("⚠️ رقم المنتج غير صالح"),

  body("quantity")
    .notEmpty()
    .withMessage("⚠️ الكمية مطلوبة")
    .isNumeric()
    .withMessage("⚠️ الكمية يجب أن تكون رقم")
    .custom((value) => value >= 0)
    .withMessage("⚠️ الكمية يجب أن تكون أكبر من أو تساوي صفر"),

  validatorMiddleware,
];
