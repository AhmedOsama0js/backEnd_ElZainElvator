const Project = require("../models/Project");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const ApiFetcher = require("../utils/ApiFetcher");

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
  } = req.body;

  if (contract || executionStages || paymentPercentages || executionStatus) {
    return next(
      new ApiError(
        "⚠️ لا يمكنك إرسال بيانات العقد أو الدفعات أو مراحل التنفيذ في مرحلة العرض.",
        400
      )
    );
  }

  // ✅ تحقق من الحقول الأساسية المطلوبة
  if (
    !client ||
    !client.name ||
    !client.phone ||
    !client.category ||
    !client.address
  ) {
    return next(new ApiError("⚠️ بيانات العميل غير مكتملة", 400));
  }

  if (!elevator || typeof elevator.numberOfElevators !== "number") {
    return next(new ApiError("⚠️ عدد المصاعد مطلوب", 400));
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

exports.getProjects = async (req, res) => {
  const api = new ApiFetcher(Project.find(), req.query)
    .filter()
    .search([
      "client.name",
      "client.phone",
      "client.category",
      "contract.number",
      "elevator.category",
      "notes.note1",
      "notes.note2",
      "notes.note3",
      "notes.note4",
      "notes.note5",
      "representative",
      "transferLocation",
    ])
    .sort()
    .paginate();

  const products = await api.getFinalQuery();
  const totalResults = await Project.countDocuments(api.getConditionsOnly());

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const totalPages = Math.ceil(totalResults / limit);

  res.status(200).json({
    results: products.length,
    totalResults,
    totalPages,
    currentPage: page,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null,
    data: products,
  });
};

exports.getProjectById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const project = await Project.findById(id);

  if (!project) {
    return next(new ApiError("⚠️ لم يتم العثور على المشروع", 404));
  }

  res.status(200).json({
    message: "✅ تم جلب المشروع بنجاح",
    data: project,
  });
});

exports.completeContractAndArchive = asyncHandler(async (req, res, next) => {
  const project = req.project;

  const allStagesCompleted = project.executionStages.every(
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

  project.executionStatus = {
    state: "completed",
  };

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
