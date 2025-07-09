const asyncHandler = require("express-async-handler");
const ApiError = require("../../utils/ApiError");

exports.updateContract = asyncHandler(async (req, res, next) => {
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

  if (!paymentPercentages) {
    return next(new ApiError("⚠️ يرجى إرسال بيانات الدفعات للتعديل", 400));
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
    payments.third == null ||
    payments.fourth == null
  ) {
    return next(
      new ApiError(
        "⚠️ يجب إتمام بيانات الدفعات الأربعة قبل دخول مرحلة التنفيذ.",
        400
      )
    );
  }

  project.status = "execution";

  project.executionStatus = {
    state: "in_progress",
  };

  await project.save();

  res.status(200).json({
    message: "✅ تم دخول العقد إلى مرحلة التنفيذ بنجاح",
    data: project,
  });
});
