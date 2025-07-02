const mongoose = require("mongoose");
mongoose.models.Project && delete mongoose.models.Project;

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
      branch: String,
      address: { type: String, required: true },
    },

    // بيانات العقد
    contract: {
      number: { type: String, required: false, unique: true },
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

projectSchema.pre("save", async function (next) {
  if (this.contract.number) return next();

  const year = new Date().getFullYear();

  const count = await mongoose.model("Project").countDocuments({
    "contract.date": {
      $gte: new Date(`${year}-01-01`),
      $lte: new Date(`${year}-12-31`),
    },
  });

  const serial = String(count + 1).padStart(3, "0");
  this.contract.number = `C-${year}-${serial}`;

  next();
});

executionStageSchema.pre("save", function (next) {
  if (!this.startDate) {
    this.startDate = new Date();
  }

  if (!this.endDate) {
    const end = new Date(this.startDate);
    end.setDate(end.getDate() + 15);
    this.endDate = end;
  }

  next();
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
