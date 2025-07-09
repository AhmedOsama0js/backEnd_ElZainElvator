const mongoose = require("mongoose");
mongoose.models.Project && delete mongoose.models.Project;
const assignContractNumber = require("../hooks/assignContractNumber");
const setExecutionDates = require("../hooks/setExecutionDates");

// ---------------------------
//   الجزء الخاص بمراحل التنفيز
// ---------------------------

const executionStageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  startDate: Date,
  endDate: Date,
  completed: { type: Boolean, default: false },
  notes: String,
});
// ---------------------------
//   الجزء الخاص بالمصعد التنفيز
// ---------------------------

const elevatorSchema = new mongoose.Schema(
  {
    category: String,
    type: String,
    numberOfElevators: { type: Number, required: true },
    stops: Number,
    floors: Number,
    entrances: Number,
    loadCapacity: String,
    machineType: String,
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

    // بيانات المصعد الأساسية
    elevator: elevatorSchema,

    // الدفعات
    paymentPercentages: {
      first: Number,
      second: Number,
      third: Number,
      fourth: Number,
    },

    // مواصفات المصعد
    specifications: {
      doorType: String,
      doorSize: String,
      innerDoor: String,
      shaftWidth: String,
      shaftLength: String,
      cabinSize: String,
      shaftPit: String,
      lastFloorHeight: String,
    },

    // السعر
    pricing: {
      basePrice: Number,
      systemPrice: Number,
      discount: Number, // اختياري
      tax: Number, // اختياري
      finalPrice: Number, // ممكن تحسبه تلقائيًا لاحقًا
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
    executionStages: [executionStageSchema],
  },
  {
    timestamps: true,
  }
);

projectSchema.pre("save", assignContractNumber);

executionStageSchema.pre("save", setExecutionDates);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
