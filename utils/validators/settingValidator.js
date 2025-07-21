const { body, param } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const Store = require("../../models/Store");
const ApiError = require("../../utils/ApiError");

exports.validateProductParam = [
  param("productId")
    .notEmpty()
    .withMessage("⚠️ رقم المنتج مطلوب")
    .isMongoId()
    .withMessage("⚠️ رقم المنتج غير صالح"),
  validatorMiddleware,
];

exports.validateProductBody = [
  body("product")
    .notEmpty()
    .withMessage("⚠️ المنتج مطلوب")
    .isMongoId()
    .withMessage("⚠️ رقم المنتج غير صالح")
    .custom(async (value, { req }) => {
      const product = await Store.findById(value);
      if (!product) {
        throw new ApiError("⚠️ المنتج غير موجود في قاعدة البيانات");
      }

      if (product.category.toString() !== req.params.stageKey) {
        throw new ApiError(
          "⚠️ هذا المنتج لا يتبع المرحلة المحددة في الرابط",
          400
        );
      }

      return true;
    }),

  body("quantity")
    .notEmpty()
    .withMessage("⚠️ الكمية مطلوبة")
    .isNumeric()
    .withMessage("⚠️ الكمية يجب أن تكون رقم")
    .custom((value) => value >= 0)
    .withMessage("⚠️ الكمية يجب أن تكون أكبر من أو تساوي صفر"),

  validatorMiddleware,
];
