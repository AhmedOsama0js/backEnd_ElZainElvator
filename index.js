require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const morgan = require("morgan");

const errorHandler = require("./middleware/errorMiddleware");
const ApiError = require("./utils/ApiError");

const app = express();
app.use(express.json());

connectDB();

const usersRoute = require("./routes/usersRoutes");
const authRoute = require("./routes/authRouters");

if (process.env.NODE_MODE === "dev") {
  app.use(morgan("dev"));
}
app.use("/api/user", usersRoute);
app.use("/api/auth", authRoute);

app.use((req, res, next) => {
  next(new ApiError(`Cannot find ${req.originalUrl} on this server ⚠️`, 404));
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server run in port http://localhost:${PORT} 🚀 `);
});
