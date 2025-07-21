const { body } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const ApiError = require("../../utils/ApiError");

exports.offerValidator = [
  // بيانات العميل
  body("client.category")
    .isIn(["individual", "company", "contractor", "real_estate", "government"])
    .withMessage("⚠️ نوع العميل غير صالح"),

  body("client.name").notEmpty().withMessage("⚠️ اسم العميل مطلوب"),

  body("client.phone")
    .notEmpty()
    .withMessage("⚠️ رقم الهاتف مطلوب")
    .isMobilePhone("ar-SA")
    .withMessage("⚠️ رقم الهاتف السعودي غير صحيح"),

  body("client.address").notEmpty().withMessage("⚠️ العنوان مطلوب"),

  // ---------- مدة المشروع ----------
  body("durationInDays")
    .isIn([30, 45, 60])
    .withMessage("مدة المشروع يجب أن تكون 30 أو 45 أو 60 يومًا"),

  // بيانات المصعد
  body("elevator.numberOfElevators")
    .isInt({ min: 1 })
    .withMessage("عدد المصاعد مطلوب ويجب أن يكون رقمًا"),

  body("elevator.category")
    .isIn(["automatic", "semi-automatic", "home-lift"])
    .withMessage("نوع المصعد غير صالح"),

  body("elevator.stops")
    .optional()
    .isNumeric()
    .withMessage("⚠️ عدد الوقوف يجب أن يكون رقم"),

  body("elevator.floors")
    .optional()
    .isNumeric()
    .withMessage("⚠️ عدد الأدوار يجب أن يكون رقم"),

  body("elevator.entrances")
    .optional()
    .isNumeric()
    .withMessage("⚠️ عدد المداخل يجب أن يكون رقم"),

  body("elevator.loadCapacity")
    .isIn([450, 630, 800])
    .withMessage("الحمولة يجب أن تكون 450 أو 630 أو 800"),

  body("elevator.machineType")
    .isIn(["chinese", "italian"])
    .withMessage("نوع الماكينة غير صالح"),

  // المواصفات
  body("specifications.doorType")
    .isIn(["semi-automatic", "center", "telescope"])
    .withMessage("نوع الباب غير صالح"),

  body("specifications.doorSize")
    .isIn([70, 80])
    .withMessage("مقاس الباب يجب أن يكون 70 أو 80"),

  body("specifications.innerDoor")
    .isIn(["automatic", "semi-automatic"])
    .withMessage("نوع الباب الداخلي غير صالح"),

  body("specifications.shaftWidth")
    .notEmpty()
    .withMessage("⚠️ عرض البئر مطلوب")
    .isNumeric()
    .withMessage("  عرض البئر يجب أن يكون رقم"),

  body("specifications.shaftLength")
    .notEmpty()
    .withMessage("⚠️ طول البئر مطلوب")
    .isNumeric()
    .withMessage("  طول البئر  يجب أن يكون رقم"),

  body("specifications.cabinSize")
    .notEmpty()
    .withMessage("⚠️ مقاس الكابينة مطلوب")
    .isNumeric()
    .withMessage(" مقاس الكابينة يجب أن يكون رقم"),

  body("specifications.shaftPit")
    .optional()
    .isNumeric()
    .withMessage("عمق البير يجب أن يكون رقم"),

  body("specifications.lastFloorHeight")
    .optional()
    .isNumeric()
    .withMessage("ارتفاع آخر دور يجب أن يكون رقم"),

  body("specifications.totalShaftHeight")
    .optional()
    .isNumeric()
    .withMessage("الارتفاع الكلي يجب أن يكون رقم"),

  // السعر
  body("pricing.basePrice")
    .isNumeric()
    .withMessage("⚠️ السعر الأساسي يجب أن يكون رقم"),

  body("pricing.systemPrice")
    .optional()
    .isNumeric()
    .withMessage("⚠️ السعر بعد النظام يجب أن يكون رقم"),

  body("pricing.discount")
    .optional()
    .isNumeric()
    .withMessage("⚠️ الخصم يجب أن يكون رقم"),

  body("pricing.tax")
    .optional()
    .isNumeric()
    .withMessage("⚠️ الضريبة يجب أن تكون رقم"),

  // بيانات إضافية وملاحظات (كلها اختيارية)
  body("representative").optional().isString(),
  body("transferLocation").optional().isString(),

  body("notes.note1").optional().isString(),
  body("notes.note2").optional().isString(),
  body("notes.note3").optional().isString(),
  body("notes.note4").optional().isString(),
  body("notes.note5").optional().isString(),
  validatorMiddleware,
];

exports.executionStageValidator = [
  body("name")
    .notEmpty()
    .withMessage("⚠️ اسم المرحلة مطلوب")
    .isString()
    .withMessage("⚠️ اسم المرحلة يجب أن يكون نص"),

  body("description")
    .optional()
    .isString()
    .withMessage("⚠️ الوصف يجب أن يكون نص"),

  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("⚠️ تاريخ البدء يجب أن يكون تاريخ صحيح"),

  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("⚠️ تاريخ الانتهاء يجب أن يكون تاريخ صحيح"),

  body("completed")
    .optional()
    .isBoolean()
    .withMessage("⚠️ هل المرحلة مكتملة؟ يجب أن تكون true أو false"),

  body("notes")
    .optional()
    .isString()
    .withMessage("⚠️ الملاحظات يجب أن تكون نص"),

  validatorMiddleware, // لا تنسى هذا
];

exports.paymentPercentagesValidator = [
  body("paymentPercentages.first")
    .notEmpty()
    .withMessage("⚠️ الدفعة الأولى مطلوبة")
    .isFloat({ min: 0, max: 100 })
    .withMessage("⚠️ الدفعة الأولى يجب أن تكون بين 0 و 100"),

  body("paymentPercentages.second")
    .notEmpty()
    .withMessage("⚠️ الدفعة الثانية مطلوبة")
    .isFloat({ min: 0, max: 100 })
    .withMessage("⚠️ الدفعة الثانية يجب أن تكون بين 0 و 100"),

  body("paymentPercentages.third")
    .notEmpty()
    .withMessage("⚠️ الدفعة الثالثة مطلوبة")
    .isFloat({ min: 0, max: 100 })
    .withMessage("⚠️ الدفعة الثالثة يجب أن تكون بين 0 و 100"),

  body().custom((body) => {
    const payments = body.paymentPercentages;
    if (!payments) return true;

    const total =
      (payments.first || 0) + (payments.second || 0) + (payments.third || 0);

    if (total > 100) {
      throw new ApiError("⚠️ مجموع الدفعات لا يجب أن يتجاوز 100%");
    }
    return true;
  }),

  validatorMiddleware,
];
