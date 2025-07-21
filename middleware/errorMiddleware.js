const ApiError = require("../utils/ApiError");

// The globalError handler that is used throughout the application
// To standardize how errors are handled depending on the operating environment (development or production).
const globalError = (err, req, res, next) => {
  // Set the default status code if it does not exist
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Determine how to send the error based on the application environment
  if (process.env.NODE_MODE === "dev") {
    return sendErrorForDev(err, res);
  } else {
    return sendErrorForPro(err, res);
  }
};

const sendErrorForDev = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorForPro = (err, res) => {
  if (err.name === "JsonWebTokenError")
    err = new ApiError("invalid token login again", 401);

  if (err.name === "TokenExpiredError")
    err = new ApiError("token is Expired login again", 401);

  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

module.exports = globalError;
