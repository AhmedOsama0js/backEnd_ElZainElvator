const asyncHandler = require("express-async-handler");
const ApiError = require("../../utils/ApiError");
const Store = require("../../models/Store");

exports.addExecutionStageProduct = asyncHandler(async (req, res, next) => {
  const project = req.project;
  const { stageKey } = req.params;
  const { productsUsed } = req.body;

  const projectStage = project.executionStages[stageKey];

  if (!Array.isArray(productsUsed) || productsUsed.length === 0) {
    return next(new ApiError("⚠️ يجب إرسال مصفوفة من المنتجات", 400));
  }

  if (projectStage.completed) {
    return next(
      new ApiError("⚠️ لا يمكن اضافة أو تعديل المنتجات بعد اكتمال المرحلة", 400)
    );
  }

  if (
    !projectStage.receiptNumber ||
    typeof projectStage.receiptNumber !== "string" ||
    !projectStage.receiptNumber.trim()
  ) {
    return next(
      new ApiError("⚠️ لا يمكن إكمال المرحلة قبل إدخال رقم السند", 400)
    );
  }

  if (
    typeof projectStage.amountPaid !== "number" ||
    projectStage.amountPaid <= 0
  ) {
    return next(
      new ApiError("⚠️ لا يمكن إكمال المرحلة قبل إدخال مبلغ مدفوع صالح", 400)
    );
  }

  // بدء session للمعاملة
  const session = await Store.startSession();
  session.startTransaction();

  try {
    // 1- التشييك على الكميات
    for (const item of productsUsed) {
      const storeProduct = await Store.findById(item.product._id).session(
        session
      );

      if (!storeProduct) {
        throw new ApiError(
          `⚠️ المنتج ${item.product.name} غير موجود في المخزن`,
          404
        );
      }

      if (item.quantity > storeProduct.quantity) {
        throw new ApiError(
          `⚠️ الكمية المطلوبة من المنتج "${storeProduct.name}" (${item.quantity}) أكبر من الكمية المتوفرة في المخزن (${storeProduct.quantity})`,
          400
        );
      }
    }

    // 2- الخصم من الكمية
    for (const item of productsUsed) {
      await Store.updateOne(
        { _id: item.product._id },
        { $inc: { quantity: -item.quantity } },
        { session }
      );
    }

    // 3- حفظ المنتجات في المرحلة
    const preparedProducts = productsUsed.map((item) => {
      return {
        product: item.product,
        name: item.product.name,
        price: item.product.price,
        unit: item.product.unit,
        category: item.product.category,
        quantity: item.quantity,
      };
    });

    projectStage.productsUsed = preparedProducts;
    await project.save({ session });

    // 4- تثبيت التغييرات
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "✅ تم إضافة المنتجات وخصم الكميات من المخزن بنجاح",
      stageKey,
      productsUsed: project.executionStages[stageKey].productsUsed,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
});

exports.completeStages = asyncHandler(async (req, res, next) => {
  const project = req.project;
  const { stageKey } = req.params;

  if (!project.executionStages || typeof project.executionStages !== "object") {
    return next(new ApiError("⚠️ لا توجد مراحل تنفيذ في هذا المشروع", 400));
  }

  const projectStage = project.executionStages[stageKey];

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

  if (
    !projectStage.receiptNumber ||
    typeof projectStage.receiptNumber !== "string" ||
    !projectStage.receiptNumber.trim()
  ) {
    return next(
      new ApiError("⚠️ لا يمكن إكمال المرحلة قبل إدخال رقم السند", 400)
    );
  }

  if (
    typeof projectStage.amountPaid !== "number" ||
    projectStage.amountPaid <= 0
  ) {
    return next(
      new ApiError("⚠️ لا يمكن إكمال المرحلة قبل إدخال مبلغ مدفوع صالح", 400)
    );
  }

  project.executionStages[stageKey].status = "completed";
  project.executionStages[stageKey].completed = true;

  const stageKeys = Object.keys(project.executionStages).sort();

  const currentIndex = stageKeys.indexOf(stageKey);
  const nextStageKey = stageKeys[currentIndex + 1];

  if (nextStageKey) {
    if (project.executionStages[nextStageKey].status === "pending") {
      project.executionStages[nextStageKey].status = "in_progress";
    }
  }

  const allStagesCompleted = stageKeys.every(
    (key) => project.executionStages[key].completed === true
  );

  if (allStagesCompleted) {
    project.executionStatus.state = "completed";
  }

  await project.save();

  res.status(200).json({
    message: `✅ تم إكمال المرحلة (${stageKey}) بنجاح`,
    currentStage: project.executionStages[stageKey],
    nextStage: nextStageKey
      ? project.executionStages[nextStageKey].status
      : null,
  });
});

exports.AddAmountOfTheBondNumber = asyncHandler(async (req, res, next) => {
  const project = req.project;
  const { stageKey } = req.params;
  const { receiptNumber, amountPaid } = req.body;

  if (!project.executionStages[stageKey]) {
    return next(new ApiError(`⚠️ المرحلة "${stageKey}" غير موجودة`, 404));
  }

  // تحقق من القيم المدخلة
  if (!receiptNumber || typeof receiptNumber !== "string") {
    return next(new ApiError("⚠️ يجب إدخال رقم السند (نص)", 400));
  }

  if (typeof amountPaid !== "number" || amountPaid < 0) {
    return next(new ApiError("⚠️ يجب إدخال مبلغ مدفوع صالح", 400));
  }

  // إضافة البيانات للمرحلة
  project.executionStages[stageKey].receiptNumber = receiptNumber.trim();
  project.executionStages[stageKey].amountPaid = amountPaid;

  // حفظ التعديلات
  await project.save();

  res.status(200).json({
    message: "✅ تم إضافة رقم السند والمبلغ المدفوع بنجاح",
    stageKey,
    receiptNumber: project.executionStages[stageKey].receiptNumber,
    amountPaid: project.executionStages[stageKey].amountPaid,
  });
});
