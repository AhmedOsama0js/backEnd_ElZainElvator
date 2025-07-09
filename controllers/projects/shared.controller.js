const Project = require("../../models/Project");
const asyncHandler = require("express-async-handler");
const ApiError = require("../../utils/ApiError");
const ApiFetcher = require("../../utils/ApiFetcher");

exports.getProjects = asyncHandler(async (req, res) => {
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
});

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

exports.getProjectStats = asyncHandler(async (req, res, next) => {
  const projectStatusAggregation = await Project.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const projectStatusCounts = {};
  projectStatusAggregation.forEach((item) => {
    projectStatusCounts[item._id] = item.count;
  });

  const executionStatusAggregation = await Project.aggregate([
    {
      $group: {
        _id: "$executionStatus.state",
        count: { $sum: 1 },
      },
    },
  ]);

  const executionStatusCounts = {};
  executionStatusAggregation.forEach((item) => {
    executionStatusCounts[item._id] = item.count;
  });

  res.status(200).json({
    projectStatusCounts,
    executionStatusCounts,
  });
});

exports.getMonthlyProjectStats = asyncHandler(async (req, res, next) => {
  const year = parseInt(req.query.year) || new Date().getFullYear();

  const monthlyData = await Project.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(`${year}-01-01`),
          $lt: new Date(`${year + 1}-01-01`),
        },
      },
    },
    {
      $group: {
        _id: { month: { $month: "$createdAt" } },
        count: { $sum: 1 },
        totalFinalPrice: { $sum: "$pricing.finalPrice" },
      },
    },
    {
      $sort: { "_id.month": 1 },
    },
  ]);

  // تجهيز الشكل النهائي
  const stats = Array.from({ length: 12 }, (_, i) => {
    const monthData = monthlyData.find((item) => item._id.month === i + 1);
    return {
      month: i + 1,
      count: monthData?.count || 0,
      totalFinalPrice: monthData?.totalFinalPrice || 0,
    };
  });

  res.status(200).json({
    year,
    stats,
  });
});
