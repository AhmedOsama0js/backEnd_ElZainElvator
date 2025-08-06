const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const ApiError = require("../../utils/ApiError");

exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("⚠️ البريد الإلكتروني مطلوب")
    .isEmail()
    .withMessage("⚠️ صيغة البريد الإلكتروني غير صحيحة")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    .withMessage("⚠️ صيغة البريد الإلكتروني غير صحيحة"),

  check("password")
    .notEmpty()
    .withMessage("⚠️ كلمة المرور مطلوبة")
    .isLength({ min: 6 })
    .withMessage("⚠️ يجب أن تكون كلمة المرور 6 أحرف على الأقل")
    .matches(/^[a-zA-Z0-9!@#$%^&*]+$/)
    .withMessage("⚠️ تحتوي كلمة المرور على رموز غير مسموح بها"),

  validatorMiddleware,
];

exports.updateUserPasswordValidator = [
  body("currentPassword")
    .notEmpty()
    .withMessage("⚠️ كلمة المرور الحالية مطلوبة")
    .isLength({ min: 8 })
    .withMessage("⚠️ يجب أن تكون كلمة المرور الحالية 8 أحرف على الأقل"),

  body("newPassword")
    .notEmpty()
    .withMessage("⚠️ كلمة المرور الجديدة مطلوبة")
    .isLength({ min: 8 })
    .withMessage("⚠️ يجب أن تكون كلمة المرور الجديدة 8 أحرف على الأقل"),

  body("passwordConfirm")
    .notEmpty()
    .withMessage("⚠️ تأكيد كلمة المرور مطلوب")
    .custom((pass, { req }) => {
      if (pass !== req.body.newPassword) {
        throw new ApiError("⚠️ تأكيد كلمة المرور لا يطابق كلمة المرور الجديدة");
      }
      return true;
    }),

  validatorMiddleware,
];

exports.resetPasswordValidator = [
  body("email")
    .notEmpty()
    .withMessage("⚠️ البريد الإلكتروني مطلوب")
    .isEmail()
    .withMessage("⚠️ الرجاء إدخال بريد إلكتروني صالح"),

  body("resetCode")
    .notEmpty()
    .withMessage("⚠️ كود التحقق مطلوب")
    .isLength({ min: 6, max: 6 })
    .withMessage("⚠️ كود التحقق يجب أن يتكون من 6 أرقام")
    .isNumeric()
    .withMessage("⚠️ كود التحقق يجب أن يحتوي على أرقام فقط"),

  body("newPassword")
    .notEmpty()
    .withMessage("⚠️ كلمة المرور الجديدة مطلوبة")
    .isLength({ min: 6 })
    .withMessage("⚠️ كلمة المرور يجب ألا تقل عن 6 أحرف"),

  validatorMiddleware,
];
