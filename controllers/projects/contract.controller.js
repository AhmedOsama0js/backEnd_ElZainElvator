const asyncHandler = require("express-async-handler");
const ApiError = require("../../utils/ApiError");

exports.updateContractPayments = asyncHandler(async (req, res, next) => {
  const project = req.project;

  if (!project) {
    return next(new ApiError("⚠️ لم يتم العثور على المشروع", 404));
  }

  const { paymentPercentages, ...otherFields } = req.body;

  if (Object.keys(otherFields).length > 0) {
    return next(
      new ApiError(
        "⚠️ لا يمكنك تعديل أي بيانات أخرى في هذه المرحلة غير الدفعات.",
        400
      )
    );
  }

  if (
    !paymentPercentages ||
    typeof paymentPercentages !== "object" ||
    Array.isArray(paymentPercentages)
  ) {
    return next(
      new ApiError(
        "⚠️ يرجى إرسال بيانات الدفعات بشكل صحيح (كائن يحتوي على first, second, third)",
        400
      )
    );
  }

  const allowedKeys = ["first", "second", "third"];
  const keys = Object.keys(paymentPercentages);

  const hasAllKeys = allowedKeys.every((key) => keys.includes(key));
  if (!hasAllKeys || keys.length !== 3) {
    return next(
      new ApiError(
        "⚠️ يجب أن تحتوي الدفعات على المفاتيح التالية فقط: first, second, third",
        400
      )
    );
  }

  for (const key of allowedKeys) {
    const value = paymentPercentages[key];
    if (typeof value !== "number" || value < 0 || value > 100) {
      return next(
        new ApiError(
          `⚠️ قيمة الدفعة '${key}' يجب أن تكون رقمًا بين 0 و 100`,
          400
        )
      );
    }
  }

  const total =
    paymentPercentages.first +
    paymentPercentages.second +
    paymentPercentages.third;

  if (total !== 100) {
    return next(
      new ApiError(
        `⚠️ مجموع نسب الدفعات يجب أن يكون 100، الحالي: ${total}`,
        400
      )
    );
  }

  project.paymentPercentages = paymentPercentages;
  await project.save();

  res.status(200).json({
    message: "✅ تم تعديل الدفعات بنجاح",
    data: project,
  });
});

exports.convertContractToExecution = asyncHandler(async (req, res, next) => {
  const project = req.project;

  if (Object.keys(req.body).length > 0) {
    return next(
      new ApiError(
        "⚠️ لا يُسمح بإرسال بيانات أثناء التحويل إلى مرحلة التنفيذ.",
        400
      )
    );
  }

  const payments = project.paymentPercentages;
  if (
    !payments ||
    payments.first == null ||
    payments.second == null ||
    payments.third == null
  ) {
    return next(
      new ApiError(
        "⚠️ يجب إتمام بيانات الدفعات الثلاثة قبل دخول مرحلة التنفيذ.",
        400
      )
    );
  }

  project.status = "execution";

  project.executionStatus = {
    state: "in_progress",
  };

  if (project.executionStages && project.executionStages.stage1) {
    project.executionStages.stage1.status = "in_progress";
  }

  await project.save();

  res.status(200).json({
    message: "✅ تم دخول العقد إلى مرحلة التنفيذ بنجاح",
    data: project,
  });
});
