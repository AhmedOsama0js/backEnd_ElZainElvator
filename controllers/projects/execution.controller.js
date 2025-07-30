const asyncHandler = require("express-async-handler");
const ApiError = require("../../utils/ApiError");

exports.addExecutionStageProduct = asyncHandler(async (req, res, next) => {
  const project = req.project;
  const { stageKey } = req.params;
  const { productsUsed } = req.body;

  if (!Array.isArray(productsUsed) || productsUsed.length === 0) {
    return next(new ApiError("⚠️ يجب إرسال مصفوفة من المنتجات", 400));
  }

  if (project.executionStages[stageKey].completed) {
    return next(
      new ApiError(
        "⚠️ لا يمكن اضافة  او تعديل المنتجات بعد اكتمال المرحلة",
        400
      )
    );
  }

  const preparedProducts = productsUsed.map((item) => {
    return {
      product: item.product,
      name: item.name,
      price: item.price,
      unit: item.unit,
      category: item.category,
      quantity: item.quantity,
    };
  });

  console.log(project.executionStages[stageKey].completed);

  project.executionStages[stageKey].productsUsed = preparedProducts;

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
