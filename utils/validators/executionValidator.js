const { body } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.addExecutionStageProductValidator = [
  body("productsUsed")
    .isArray({ min: 1 })
    .withMessage("⚠️ يجب إرسال مصفوفة من المنتجات"),

  body("productsUsed.*.product._id")
    .notEmpty()
    .withMessage("⚠️ كل منتج يجب أن يحتوي على معرف المنتج (product)"),

  body("productsUsed.*.product.name")
    .notEmpty()
    .withMessage("⚠️ كل منتج يجب أن يحتوي على الاسم (name)"),

  body("productsUsed.*.product.price")
    .isNumeric()
    .withMessage("⚠️ كل منتج يجب أن يحتوي على السعر (price) كرقم"),

  body("productsUsed.*.product.unit")
    .notEmpty()
    .withMessage("⚠️ كل منتج يجب أن يحتوي على الوحدة (unit)"),

  body("productsUsed.*.quantity")
    .isNumeric()
    .withMessage("⚠️ كل منتج يجب أن يحتوي على الكمية (quantity) كرقم"),

  body("productsUsed").custom((products, { req }) => {
    const stageKey = req.params.stageKey;
    const invalidProduct = products.find(
      (item) => item.product.category !== stageKey
    );
    if (invalidProduct) {
      throw new Error(
        `⚠️ المنتج "${invalidProduct.product.name}" ليس من نفس الفئة المطلوبة stageKey`
      );
    }
    return true;
  }),
  validatorMiddleware,
];

exports.addBondValidation = [
  body("receiptNumber")
    .notEmpty()
    .withMessage("⚠️ يجب إدخال رقم السند")
    .isString()
    .withMessage("⚠️ رقم السند يجب أن يكون نص"),

  body("amountPaid")
    .notEmpty()
    .withMessage("⚠️ يجب إدخال المبلغ المدفوع")
    .isNumeric()
    .withMessage("⚠️ المبلغ المدفوع يجب أن يكون رقم")
    .custom((value) => {
      if (value < 0) {
        throw new Error("⚠️ المبلغ المدفوع لا يمكن أن يكون أقل من 0");
      }
      return true;
    }),

  validatorMiddleware,
];
