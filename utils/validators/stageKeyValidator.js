const { param } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

const validStages = ["stage1", "stage2", "stage3"];

exports.validateStageParam = [
  param("stageKey")
    .notEmpty()
    .withMessage("⚠️ اسم المرحلة مطلوب")
    .isIn(validStages)
    .withMessage("⚠️ اسم المرحلة غير صحيح"),
  validatorMiddleware,
];
