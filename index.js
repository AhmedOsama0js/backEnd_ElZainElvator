require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const morgan = require("morgan");

const errorHandler = require("./middleware/errorMiddleware");
const ApiError = require("./utils/ApiError");
const cors = require("cors");

const allowedOrigins = ["http://localhost:5173", "http://localhost:3000"];

const app = express();
app.use(express.json());

require("./middleware/security")(app);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

connectDB();

const usersRoute = require("./routes/usersRoutes");
const authRoute = require("./routes/authRouters");
const productRoutes = require("./routes/projectRoutes");

if (process.env.NODE_MODE === "dev") {
  app.use(morgan("dev"));
}
app.use("/api/user", usersRoute);
app.use("/api/auth", authRoute);
app.use("/api/product", productRoutes);

app.use((req, res, next) => {
  next(new ApiError(`Cannot find ${req.originalUrl} on this server ⚠️`, 404));
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server run in port http://localhost:${PORT} 🚀 `);
});
