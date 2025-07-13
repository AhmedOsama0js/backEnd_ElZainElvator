const mongoose = require("mongoose");
mongoose.models.Project && delete mongoose.models.Project;
const assignContractNumber = require("../hooks/assignContractNumber");
const setExecutionDates = require("../hooks/setExecutionDates");
const finalPrice = require("../hooks/finalPrice");

// ---------------------------
//   الجزء الخاص بمراحل التنفيز
// ---------------------------

const executionStageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed"],
      default: "pending",
    },
    startDate: Date,
    endDate: Date,
    completed: { type: Boolean, default: false },
    notes: String,
    productsUsed: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: Number,
      },
    ],
  },
  { _id: false }
);

// ---------------------------
//   الجزء الخاص بالمصعد التنفيز
// ---------------------------

const elevatorSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["automatic", "semi-automatic", "home-lift"],
      required: true,
    },
    numberOfElevators: { type: Number, required: true },
    stops: Number,
    floors: Number,
    entrances: Number,
    loadCapacity: {
      type: Number,
      enum: [450, 630, 800],
      required: true,
    },
    machineType: {
      type: String,
      enum: ["chinese", "italian"],
      required: true,
    },
    features: {
      electronicCard: Boolean,
      battery: Boolean,
      vvvf: Boolean,
      warranty: Boolean,
      dismantleOldElevator: Boolean,
    },
  },
  { _id: false }
);

// ---------------------------
// السكيمه الرئيسية للمشروع
// ---------------------------

const projectSchema = new mongoose.Schema(
  {
    // مراحل العقد (عرض - عقد - تنفيذ - أرشيف )
    status: {
      type: String,
      enum: ["offer", "contract", "execution", "archived"],
      default: "offer",
    },

    // بيانات العميل
    client: {
      category: {
        type: String,
        enum: [
          "individual",
          "company",
          "contractor",
          "real_estate",
          "government",
        ],
        required: true,
      },
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
    },

    // بيانات العقد
    contract: {
      number: { type: String, required: false, unique: true },
      seq: { type: Number },
      date: {
        type: Date,
        default: Date.now,
      },
    },

    // مدة المشروع بالأيام
    durationInDays: {
      type: Number,
      enum: [30, 45, 60],
      required: true,
    },

    // بيانات المصعد الأساسية
    elevator: elevatorSchema,

    // الدفعات
    paymentPercentages: {
      first: Number,
      second: Number,
      third: Number,
    },

    // مواصفات المصعد
    specifications: {
      doorType: {
        type: String,
        enum: ["semi-automatic", "center", "telescope"],
        required: true,
      },
      doorSize: {
        type: Number,
        enum: [70, 80],
        required: true,
      },
      innerDoor: {
        type: String,
        enum: ["automatic", "semi-automatic"],
        required: true,
      },
      shaftWidth: Number,
      shaftLength: Number,
      cabinSize: Number,
      shaftPit: Number,
      lastFloorHeight: Number,
      totalShaftHeight: Number, //الارتفاع الكلي = عمق البير + ارتفاع آخر دور + (عدد الأدوار - 1) × ارتفاع الدور العادي
    },

    // السعر
    pricing: {
      basePrice: Number,
      systemPrice: Number,
      discount: Number, // اختياري
      tax: Number, // اختياري
      finalPrice: Number,
    },

    // بيانات إضافية
    representative: String,
    transferLocation: String,

    // ملاحظات
    notes: {
      note1: String,
      note2: String,
      note3: String,
      note4: String,
      note5: String,
    },

    // حالات  العقد
    executionStatus: {
      state: {
        type: String,
        enum: ["not_started", "in_progress", "completed", "stopped"],
        default: "not_started",
      },
      stopReason: {
        type: String,
        required: function () {
          return this.executionStatus?.state === "stopped";
        },
      },
    },

    // مراحل التنفيذ
    executionStages: {
      stage1: executionStageSchema,
      stage2: executionStageSchema,
      stage3: executionStageSchema,
    },
  },
  {
    timestamps: true,
  }
);

projectSchema.pre("save", assignContractNumber);

projectSchema.pre("save", setExecutionDates);

projectSchema.pre("save", finalPrice);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
