// controllers/stores/store.controller.js
const Store = require("../models/Store");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const ApiFetcher = require("../utils/ApiFetcher");
const removeProductFromSettings = require("../hooks/removeProductFromSettings");

exports.getAllStores = asyncHandler(async (req, res, next) => {
  const api = new ApiFetcher(Store.find(), req.query)
    .filter()
    .search(["name", "category", "notes"])
    .sort()
    .paginate();

  const stores = await api.getFinalQuery();
  const totalResults = await Store.countDocuments(api.getConditionsOnly());

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const totalPages = Math.ceil(totalResults / limit);

  res.status(200).json({
    results: stores.length,
    totalResults,
    totalPages,
    currentPage: page,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null,
    data: stores,
  });
});

exports.getStoreById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const store = await Store.findById(id);

  if (!store) {
    return next(new ApiError("❌ المتجر غير موجود", 404));
  }

  res.status(200).json({
    message: "✅ تم جلب بيانات المتجر بنجاح",
    data: store,
  });
});

exports.createStore = asyncHandler(async (req, res, next) => {
  const { name, quantity, unit, category, price, notes } = req.body;

  // ✅ التحقق من الحقول المطلوبة فقط
  if (!name || quantity == null || !unit || !category || price == null) {
    return next(
      new ApiError(
        "⚠️ جميع الحقول مطلوبة (name, quantity, unit, category, price)",
        400
      )
    );
  }

  // ✅ إنشاء العنصر
  const newStore = await Store.create({
    name,
    quantity,
    unit,
    category,
    price,
    notes,
  });

  res.status(201).json({
    message: "✅ تم إنشاء المنتج في المخزن بنجاح",
    data: newStore,
  });
});

exports.updateStore = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const updatedStore = await Store.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedStore) {
    return next(new ApiError("❌ المتجر غير موجود", 404));
  }

  res.status(200).json({
    message: "✅ تم تعديل بيانات المتجر بنجاح",
    data: updatedStore,
  });
});

exports.deleteStore = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const store = await Store.findById(id);
  if (!store) return next(new ApiError("❌ المتجر غير موجود", 404));

  await store.deleteOne();

  await removeProductFromSettings(id);

  res.status(200).json({
    message: "🗑️ تم حذف المتجر بنجاح",
  });
});

exports.getStoreStats = asyncHandler(async (req, res, next) => {
  // 1. عدد المنتجات المتوفرة وغير المتوفرة
  const availabilityAgg = await Store.aggregate([
    {
      $group: {
        _id: "$available",
        count: { $sum: 1 },
      },
    },
  ]);

  const availabilityCounts = {
    available: 0,
    unavailable: 0,
  };
  availabilityAgg.forEach((item) => {
    if (item._id === true) availabilityCounts.available = item.count;
    else availabilityCounts.unavailable = item.count;
  });

  // 2. عدد المنتجات حسب الفئة
  const categoryAgg = await Store.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
  ]);

  const categoryCounts = {};
  categoryAgg.forEach((item) => {
    categoryCounts[item._id] = item.count;
  });

  // 3. المنتجات القليلة (quantity < 5)
  const lowStockCount = await Store.countDocuments({ quantity: { $lt: 5 } });

  // 4. أغلى وأرخص منتج
  const mostExpensive = await Store.findOne().sort({ price: -1 }).limit(1);
  const cheapest = await Store.findOne().sort({ price: 1 }).limit(1);

  // 5. متوسط السعر
  const avgPriceAgg = await Store.aggregate([
    {
      $group: {
        _id: null,
        avgPrice: { $avg: "$price" },
      },
    },
  ]);
  const avgPrice = avgPriceAgg[0]?.avgPrice || 0;

  // 6. عدد المنتجات حسب الوحدة
  const unitAgg = await Store.aggregate([
    {
      $group: {
        _id: "$unit",
        count: { $sum: 1 },
      },
    },
  ]);
  const unitCounts = {};
  unitAgg.forEach((item) => {
    unitCounts[item._id] = item.count;
  });

  // 🟢 الرد النهائي
  res.status(200).json({
    availabilityCounts,
    categoryCounts,
    lowStockCount,
    avgPrice,
    mostExpensive,
    cheapest,
    unitCounts,
  });
});
