// controllers/projectSettings.controller.js
const Settings = require("../models/Settings");
const asyncHandler = require("express-async-handler");

const validStages = ["stage1Products", "stage2Products", "stage3Products"];

function validateStageKey(stageKey) {
  return validStages.includes(stageKey);
}

exports.addProductToStage = async (req, res, next) => {
  const { stageKey } = req.params;
  const { product, quantity } = req.body;

  if (!validateStageKey(stageKey)) {
    return res.status(400).json({ message: "🚫 اسم المرحلة غير صحيح" });
  }

  const settings = await Settings.findOne();
  if (!settings)
    return res.status(404).json({ message: "🚫 لم يتم العثور على إعدادات" });

  const exists = settings[stageKey].find(
    (p) => p.product.toString() === product
  );
  if (exists)
    return res.status(400).json({ message: "⚠️ المنتج موجود بالفعل" });

  settings[stageKey].push({ product, quantity });
  await settings.save();

  res.json({ message: "✅ تم إضافة المنتج بنجاح" });
};

exports.updateProductInStage = async (req, res, next) => {
  const { stageKey, productId } = req.params;
  const { quantity } = req.body;

  if (!validateStageKey(stageKey)) {
    return res.status(400).json({ message: "🚫 اسم المرحلة غير صحيح" });
  }

  const settings = await Settings.findOne();
  if (!settings)
    return res.status(404).json({ message: "🚫 لم يتم العثور على إعدادات" });

  const item = settings[stageKey].find(
    (p) => p.product.toString() === productId
  );
  if (!item)
    return res
      .status(404)
      .json({ message: "🚫 المنتج غير موجود في هذه المرحلة" });

  item.quantity = quantity;
  await settings.save();

  res.json({ message: "✅ تم التعديل بنجاح" });
};

exports.deleteProductFromStage = async (req, res, next) => {
  const { stageKey, productId } = req.params;

  if (!validateStageKey(stageKey)) {
    return res.status(400).json({ message: "🚫 اسم المرحلة غير صحيح" });
  }

  const settings = await Settings.findOne();
  if (!settings)
    return res.status(404).json({ message: "🚫 لم يتم العثور على إعدادات" });

  settings[stageKey] = settings[stageKey].filter(
    (p) => p.product.toString() !== productId
  );
  await settings.save();

  res.json({ message: "✅ تم حذف المنتج من المرحلة" });
};

exports.getAllSettings = asyncHandler(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    sort = "-createdAt",
    stage,
    productName,
  } = req.query;

  const validStages = ["stage1Products", "stage2Products", "stage3Products"];
  const skip = (page - 1) * limit;

  let selectedStages;
  let populateOptions;

  if (stage && validStages.includes(stage)) {
    selectedStages = [stage];
    populateOptions = [{ path: `${stage}.product` }];
  } else {
    selectedStages = validStages;
    populateOptions = validStages.map((s) => ({ path: `${s}.product` }));
  }

  const settings = await Settings.find()
    .select(selectedStages.join(" "))
    .populate(populateOptions)
    .sort(sort)
    .lean();

  let allProducts = [];

  settings.forEach((setting) => {
    selectedStages.forEach((s) => {
      if (Array.isArray(setting[s])) {
        setting[s].forEach((item) => {
          allProducts.push({
            settingId: setting._id,
            stage: s,
            ...item,
          });
        });
      }
    });
  });

  if (productName) {
    const searchTerm = productName.toLowerCase();
    allProducts = allProducts.filter((item) =>
      item.product?.name?.toLowerCase().includes(searchTerm)
    );
  }

  // ✅ pagination داخلي
  const totalResults = allProducts.length;
  const paginatedProducts = allProducts.slice(skip, skip + Number(limit));
  const totalPages = Math.ceil(totalResults / limit);

  res.status(200).json({
    results: paginatedProducts.length,
    totalResults,
    totalPages,
    currentPage: Number(page),
    nextPage: page < totalPages ? Number(page) + 1 : null,
    prevPage: page > 1 ? Number(page) - 1 : null,
    data: paginatedProducts,
  });
});
