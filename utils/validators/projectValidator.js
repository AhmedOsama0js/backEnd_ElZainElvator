const { body } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.offerValidator = [
  // بيانات العميل
  body("client.category")
    .isIn(["individual", "company", "contractor", "real_estate", "government"])
    .withMessage("⚠️ نوع العميل غير صالح"),

  body("client.name").notEmpty().withMessage("⚠️ اسم العميل مطلوب"),

  body("client.phone")
    .notEmpty()
    .withMessage("⚠️ رقم الهاتف مطلوب")
    .isMobilePhone("ar-EG")
    .withMessage("⚠️ رقم الهاتف غير صحيح"),

  body("client.address").notEmpty().withMessage("⚠️ العنوان مطلوب"),

  // بيانات المصعد
  body("elevator.numberOfElevators")
    .isNumeric()
    .withMessage("⚠️ عدد المصاعد يجب أن يكون رقم"),

  body("elevator.category").notEmpty().withMessage("⚠️ تصنيف المصعد مطلوب"),

  body("elevator.type").notEmpty().withMessage("⚠️ نوع المصعد مطلوب"),

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
    .optional()
    .isString()
    .withMessage("⚠️ حمولة المصعد يجب أن تكون نص"),

  body("elevator.machineType")
    .optional()
    .isString()
    .withMessage("⚠️ نوع الماكينة يجب أن يكون نص"),

  // المواصفات
  body("specifications.doorType").notEmpty().withMessage("⚠️ نوع الباب مطلوب"),

  body("specifications.doorSize").notEmpty().withMessage("⚠️ مقاس الباب مطلوب"),

  body("specifications.innerDoor")
    .notEmpty()
    .withMessage("⚠️ نوع الباب الداخلي مطلوب"),

  body("specifications.shaftWidth")
    .notEmpty()
    .withMessage("⚠️ عرض البئر مطلوب"),

  body("specifications.shaftLength")
    .notEmpty()
    .withMessage("⚠️ طول البئر مطلوب"),

  body("specifications.cabinSize")
    .notEmpty()
    .withMessage("⚠️ مقاس الكابينة مطلوب"),

  body("specifications.shaftPit").notEmpty().withMessage("⚠️ عمق البئر مطلوب"),

  body("specifications.lastFloorHeight")
    .notEmpty()
    .withMessage("⚠️ ارتفاع آخر دور مطلوب"),

  // السعر
  body("pricing.basePrice")
    .isNumeric()
    .withMessage("⚠️ السعر الأساسي يجب أن يكون رقم"),

  body("pricing.systemPrice")
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

  body("pricing.finalPrice")
    .isNumeric()
    .withMessage("⚠️ السعر النهائي يجب أن يكون رقم"),

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

exports.updateOfferValidator = [
  // ✅ client
  body("client.category")
    .optional()
    .isIn(["individual", "company", "contractor", "real_estate", "government"])
    .withMessage("⚠️ نوع العميل غير صالح"),
  body("client.name").optional().isString().withMessage("⚠️ الاسم غير صحيح"),
  body("client.phone")
    .optional()
    .isMobilePhone("ar-EG")
    .withMessage("⚠️ رقم الهاتف غير صحيح"),
  body("client.address").optional().notEmpty().withMessage("⚠️ العنوان مطلوب"),

  // ✅ elevator
  body("elevator.numberOfElevators")
    .optional()
    .isNumeric()
    .withMessage("⚠️ عدد المصاعد يجب أن يكون رقم"),
  body("elevator.category").optional().isString(),
  body("elevator.type").optional().isString(),
  body("elevator.stops").optional().isNumeric(),
  body("elevator.floors").optional().isNumeric(),
  body("elevator.entrances").optional().isNumeric(),
  body("elevator.loadCapacity").optional().isString(),
  body("elevator.machineType").optional().isString(),

  // ✅ elevator.features
  body("elevator.features.electronicCard").optional().isBoolean(),
  body("elevator.features.battery").optional().isBoolean(),
  body("elevator.features.vvvf").optional().isBoolean(),
  body("elevator.features.warranty").optional().isBoolean(),
  body("elevator.features.dismantleOldElevator").optional().isBoolean(),

  // ✅ specifications
  body("specifications.doorType").optional().isString(),
  body("specifications.doorSize").optional().isString(),
  body("specifications.innerDoor").optional().isString(),
  body("specifications.shaftWidth").optional().isString(),
  body("specifications.shaftLength").optional().isString(),
  body("specifications.cabinSize").optional().isString(),
  body("specifications.shaftPit").optional().isString(),
  body("specifications.lastFloorHeight").optional().isString(),

  // ✅ pricing
  body("pricing.basePrice").optional().isNumeric(),
  body("pricing.systemPrice").optional().isNumeric(),
  body("pricing.discount").optional().isNumeric(),
  body("pricing.tax").optional().isNumeric(),
  body("pricing.finalPrice").optional().isNumeric(),

  // ✅ other fields
  body("representative").optional().isString(),
  body("transferLocation").optional().isString(),

  // ✅ notes
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

  body("paymentPercentages.fourth")
    .notEmpty()
    .withMessage("⚠️ الدفعة الرابعة مطلوبة")
    .isFloat({ min: 0, max: 100 })
    .withMessage("⚠️ الدفعة الرابعة يجب أن تكون بين 0 و 100"),

  body().custom((body) => {
    const payments = body.paymentPercentages;
    if (!payments) return true;

    const total =
      (payments.first || 0) +
      (payments.second || 0) +
      (payments.third || 0) +
      (payments.fourth || 0);

    if (total > 100) {
      throw new Error("⚠️ مجموع الدفعات لا يجب أن يتجاوز 100%");
    }
    return true;
  }),

  validatorMiddleware,
];
