const asyncHandler = require("express-async-handler");
const ApiError = require("../../utils/ApiError");

exports.completeContractAndArchive = asyncHandler(async (req, res, next) => {
  const project = req.project;

  console.log(Object.values(project.executionStages));

  const allStagesCompleted = Object.values(project.executionStages).every(
    (stage) => stage.completed === true
  );

  if (!allStagesCompleted) {
    return next(
      new ApiError(
        "⚠️ لا يمكن أرشفة المشروع إلا بعد اكتمال جميع مراحل التنفيذ.",
        400
      )
    );
  }

  project.status = "archived";

  await project.save();

  res.status(200).json({
    message: "✅ تم اكتمال التنفيذ وأرشفة المشروع بنجاح",
    data: project,
  });
});

exports.toggleContractExecution = asyncHandler(async (req, res, next) => {
  const project = req.project;

  const currentState = project.executionStatus?.state || "not_started";

  if (currentState === "in_progress") {
    const { stopReason } = req.body;

    if (!stopReason || typeof stopReason !== "string") {
      return next(
        new ApiError("⚠️ يجب كتابة سبب الإيقاف عند محاولة إيقاف التنفيذ.", 400)
      );
    }

    project.executionStatus = {
      state: "stopped",
      stopReason: stopReason,
    };

    await project.save();

    return res.status(200).json({
      message: "⛔ تم إيقاف تنفيذ العقد مؤقتًا",
      data: project,
    });
  }

  if (currentState === "stopped") {
    project.executionStatus = {
      state: "in_progress",
      stopReason: undefined,
    };

    await project.save();

    return res.status(200).json({
      message: "✅ تم استئناف تنفيذ العقد بنجاح",
      data: project,
    });
  }

  return next(
    new ApiError("⚠️ لا يمكن تنفيذ هذا الأمر على الحالة الحالية.", 400)
  );
});

exports.archiveStoppedContract = asyncHandler(async (req, res, next) => {
  const project = req.project;

  if (project.executionStatus?.state !== "stopped") {
    return next(
      new ApiError("⚠️ لا يمكن أرشفة العقد إلا إذا كان التنفيذ متوقفًا", 400)
    );
  }

  project.status = "archived";

  await project.save();

  res.status(200).json({
    message: "📦 تم أرشفة العقد المتوقف بنجاح",
    data: project,
  });
});
