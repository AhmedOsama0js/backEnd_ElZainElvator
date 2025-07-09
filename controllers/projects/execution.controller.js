const asyncHandler = require("express-async-handler");
const ApiError = require("../../utils/ApiError");

exports.addExecutionStage = asyncHandler(async (req, res, next) => {
  const project = req.project;

  const { name, description, startDate, endDate, completed, notes } = req.body;

  if (!name) {
    return next(new ApiError("⚠️ يجب إدخال اسم المرحلة", 400));
  }

  project.executionStages.push({
    name,
    description,
    startDate,
    endDate,
    completed,
    notes,
  });

  await project.save();

  res.status(201).json({
    message: "✅ تم إضافة مرحلة تنفيذ جديدة بنجاح",
    data: project.executionStages,
  });
});

exports.updateExecutionStage = asyncHandler(async (req, res, next) => {
  const project = req.project;
  const stageId = req.params.stageId;
  const stage = project.executionStages.id(stageId);

  if (!stage) {
    return next(new ApiError("⚠️ لم يتم العثور على مرحلة التنفيذ", 404));
  }

  const { name, description, startDate, endDate, completed, notes } = req.body;

  if (name !== undefined) stage.name = name;
  if (description !== undefined) stage.description = description;
  if (startDate !== undefined) stage.startDate = startDate;
  if (endDate !== undefined) stage.endDate = endDate;
  if (completed !== undefined) stage.completed = completed;
  if (notes !== undefined) stage.notes = notes;

  await project.save();

  res.status(200).json({
    message: "✅ تم تعديل مرحلة التنفيذ بنجاح",
    data: stage,
  });
});

exports.deleteExecutionStage = asyncHandler(async (req, res, next) => {
  const project = req.project;
  const stageId = req.params.stageId;

  const stage = project.executionStages.id(stageId);
  if (!stage) {
    return next(new ApiError("⚠️ لم يتم العثور على مرحلة التنفيذ", 404));
  }

  project.executionStages.pull(stageId);

  await project.save();

  res.status(200).json({
    message: "🗑️ تم حذف مرحلة التنفيذ بنجاح",
  });
});
