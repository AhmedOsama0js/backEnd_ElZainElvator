const asyncHandler = require("express-async-handler");
const ApiError = require("../../utils/ApiError");
const Settings = require("../../models/Settings");

exports.addExecutionStageProduct = asyncHandler(async (req, res, next) => {
  const project = req.project;
  const { stageKey } = req.params;

  const settings = await Settings.findOne();

  if (!settings || !settings[stageKey]) {
    return next(new ApiError("⚠️ المرحلة غير موجودة في الإعدادات", 404));
  }

  const stageData = settings[stageKey];

  project.executionStages[stageKey].productsUsed.push(...stageData);

  await project.save();

  res.status(201).json({
    message: "✅ تم إضافة المنتجات إلى المرحلة بنجاح",
    stageKey,
    productsUsed: project.executionStages[stageKey].productsUsed,
  });
});

exports.completeStages = asyncHandler(async (req, res, next) => {
  const project = req.project;
  const { stageKey } = req.params;

  if (!project.executionStages || typeof project.executionStages !== "object") {
    return next(new ApiError("⚠️ لا توجد مراحل تنفيذ في هذا المشروع", 400));
  }

  const projectStage = project.executionStages[stageKey];
  console.log(projectStage);

  if (!projectStage) {
    return next(new ApiError("⚠️ المرحلة المطلوبة غير موجودة", 404));
  }

  if (
    !Array.isArray(projectStage.productsUsed) ||
    projectStage.productsUsed.length === 0
  ) {
    return next(
      new ApiError("⚠️ لا يمكن إكمال المرحلة قبل إضافة المنتجات", 400)
    );
  }

  // تحديث الحالة
  project.executionStages[stageKey].status = "completed";
  project.executionStages[stageKey].completed = true;

  await project.save();

  res.status(200).json({
    message: `✅ تم إكمال المرحلة (${stageKey}) بنجاح`,
    stage: project.executionStages[stageKey],
  });
});

// exports.updateExecutionStage = asyncHandler(async (req, res, next) => {
//   const project = req.project;
//   const stageId = req.params.stageId;
//   const stage = project.executionStages.id(stageId);

//   if (!stage) {
//     return next(new ApiError("⚠️ لم يتم العثور على مرحلة التنفيذ", 404));
//   }

//   const { name, description, startDate, endDate, completed, notes } = req.body;

//   if (name !== undefined) stage.name = name;
//   if (description !== undefined) stage.description = description;
//   if (startDate !== undefined) stage.startDate = startDate;
//   if (endDate !== undefined) stage.endDate = endDate;
//   if (completed !== undefined) stage.completed = completed;
//   if (notes !== undefined) stage.notes = notes;

//   await project.save();

//   res.status(200).json({
//     message: "✅ تم تعديل مرحلة التنفيذ بنجاح",
//     data: stage,
//   });
// });

// exports.deleteExecutionStage = asyncHandler(async (req, res, next) => {
//   const project = req.project;
//   const stageId = req.params.stageId;

//   const stage = project.executionStages.id(stageId);
//   if (!stage) {
//     return next(new ApiError("⚠️ لم يتم العثور على مرحلة التنفيذ", 404));
//   }

//   project.executionStages.pull(stageId);

//   await project.save();

//   res.status(200).json({
//     message: "🗑️ تم حذف مرحلة التنفيذ بنجاح",
//   });
// });
