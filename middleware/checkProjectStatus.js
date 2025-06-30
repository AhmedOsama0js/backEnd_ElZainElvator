const Project = require("../models/Project");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("express-async-handler");

const checkProjectStatus = (allowedStatuses = []) =>
  asyncHandler(async (req, res, next) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return next(new ApiError("❌ لم يتم العثور على المشروع", 404));
    }

    if (!allowedStatuses.includes(project.status)) {
      return next(
        new ApiError(
          `⚠️ لا يمكن تنفيذ هذه العملية لأن حالة المشروع هي: ${project.status}`,
          400
        )
      );
    }

    req.project = project;
    next();
  });

module.exports = checkProjectStatus;
