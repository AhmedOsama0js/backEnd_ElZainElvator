const Project = require("../../models/Project");
const asyncHandler = require("express-async-handler");
const ApiError = require("../../utils/ApiError");

exports.createOffer = asyncHandler(async (req, res, next) => {
  const {
    client,
    elevator,
    specifications,
    pricing,
    representative,
    transferLocation,
    notes,
    contract,
    paymentPercentages,
    executionStages,
    executionStatus,
    durationInDays,
  } = req.body;

  if (contract || executionStages || paymentPercentages || executionStatus) {
    return next(
      new ApiError(
        "⚠️ لا يمكنك إرسال بيانات العقد أو الدفعات أو مراحل التنفيذ في مرحلة العرض.",
        400
      )
    );
  }

  if (pricing.finalPrice) {
    return next(
      new ApiError("⚠️ لا يجب اضافة (finalPrice) لأنه يتم حسابه تلقائيًا", 400)
    );
  }

  const newProject = await Project.create({
    status: "offer",
    client,
    elevator,
    specifications,
    pricing,
    representative,
    transferLocation,
    notes,
    durationInDays,
  });

  res.status(201).json({
    message: "✅ تم إضافة العرض بنجاح",
    data: newProject,
  });
});

exports.updateOffer = asyncHandler(async (req, res, next) => {
  const projectId = req.params.id;

  const project = req.project;
  if (!project) {
    return next(new ApiError("⚠️ لم يتم العثور على العرض", 404));
  }

  const {
    contract,
    paymentPercentages,
    executionStages,
    status,
    executionStatus,
    ...allowedFields
  } = req.body;

  if (
    contract ||
    paymentPercentages ||
    executionStages ||
    status ||
    executionStatus
  ) {
    return next(
      new ApiError(
        "⚠️ لا يمكنك تعديل بيانات العقد أو الدفعات أو مراحل التنفيذ أو الحالة في هذه المرحلة.",
        400
      )
    );
  }

  const { pricing } = allowedFields;

  if (pricing.finalPrice) {
    return next(
      new ApiError("⚠️ لا يجب اضافة (finalPrice) لأنه يتم حسابه تلقائيًا", 400)
    );
  }

  const updatedProject = await Project.findByIdAndUpdate(
    projectId,
    allowedFields,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    message: "✅ تم تعديل بيانات العرض بنجاح",
    data: updatedProject,
  });
});

exports.deleteOffer = asyncHandler(async (req, res, next) => {
  const project = req.project;

  if (!project) {
    return next(new ApiError("⚠️ لم يتم العثور على العرض", 404));
  }

  await project.deleteOne();

  res.status(200).json({
    message: "🗑️ تم حذف العرض بنجاح",
  });
});

exports.convertOfferToContract = asyncHandler(async (req, res, next) => {
  const project = req.project;

  if (Object.keys(req.body).length > 0) {
    return next(
      new ApiError("⚠️ لا يُسمح بإرسال بيانات أثناء التحويل إلى عقد.", 400)
    );
  }

  project.status = "contract";
  await project.save();

  res.status(200).json({
    message: "✅ تم تحويل المشروع إلى عقد بنجاح",
    data: project,
  });
});
