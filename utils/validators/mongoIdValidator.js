const { param } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.mongoIdValidator = [
  param("id").isMongoId().withMessage("⚠️ المعرف (ID) غير صالح"),
  validatorMiddleware,
];
