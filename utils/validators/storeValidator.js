const { body } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const Store = require("../../models/Store");
const ApiError = require("../../utils/ApiError");

exports.createStoreValidator = [
  body("name")
    .notEmpty()
    .withMessage("⚠️ الاسم مطلوب.")
    .isString()
    .withMessage("⚠️ الاسم يجب أن يكون نص.")
    .trim(),

  body("quantity")
    .notEmpty()
    .withMessage("⚠️ الكمية مطلوبة.")
    .isFloat({ min: 0 })
    .withMessage("⚠️ الكمية يجب أن تكون رقمًا أكبر من أو يساوي 0."),

  body("unit")
    .optional()
    .isIn(["piece", "meter", "kg", "box", "liter"])
    .withMessage("⚠️ الوحدة غير مسموح بها."),

  body("category")
    .notEmpty()
    .withMessage("⚠️ الفئة مطلوبة.")
    .isIn(["stage1", "stage2", "stage3"])
    .withMessage("⚠️ الفئة غير صحيحة."),

  body("name").custom(async (value, { req }) => {
    const existingStore = await Store.findOne({
      name: value.trim(),
      category: req.body.category,
    });

    if (existingStore && existingStore._id.toString() !== req.params.id) {
      throw new ApiError("⚠️ هذا الاسم موجود بالفعل داخل نفس القسم.");
    }

    return true;
  }),

  body("price")
    .notEmpty()
    .withMessage("⚠️ السعر مطلوب.")
    .isFloat({ min: 0 })
    .withMessage("⚠️ السعر يجب أن يكون رقمًا أكبر من أو يساوي 0."),

  body("available")
    .optional()
    .isBoolean()
    .withMessage("⚠️ القيمة يجب أن تكون true أو false."),

  body("notes")
    .optional()
    .isString()
    .withMessage("⚠️ الملاحظات يجب أن تكون نص."),

  validatorMiddleware,
];
