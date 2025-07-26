const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const logger = require("../utils/logger");

const suspiciousBlocker = (req, res, next) => {
  const patterns = [
    "cmd",
    "sco",
    "shell",
    "upload",
    "config",
    ".env",
    "php",
    "admin",
    "wp",
  ];

  const isBad =
    patterns.some((p) => req.url.toLowerCase().includes(p)) ||
    req.url.endsWith(".php");

  if (isBad) {
    logger.warn({
      ip: req.ip,
      url: req.originalUrl,
      status: 403,
      reason: "نمط مشبوه",
      type: "suspicious-request",
    });

    return res.status(403).send("⛔ Forbidden");
  }

  next();
};

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 200,
  message: "⛔ Too many requests, try again later.",
  handler: (req, res, next) => {
    logger.warn({
      ip: req.ip,
      url: req.originalUrl,
      status: 429,
      reason: "بلوغ حد الاقصي الطلبات",
      type: "rate-limit",
    });

    res.status(429).send({
      message: "⛔ تم حظر الوصول مؤقتًا بسبب عدد كبير من الطلبات. حاول لاحقًا.",
    });
  },
});

module.exports = function (app) {
  app.use(helmet());
  app.use(mongoSanitize());
  app.use(xss());
  app.use(hpp());
  app.use(limiter);
  app.use(suspiciousBlocker);
};
