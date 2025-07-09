const fs = require("fs");
const path = require("path");

const {
  getCurrentTimeWithMilliseconds,
} = require("./getCurrentTimeWithMilliseconds");

const logDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const writeLog = (level, data) => {
  const logPath = path.join(logDir, `${level}.log`);

  const logEntry = {
    timestamp: getCurrentTimeWithMilliseconds(),
    level,
    ...data,
  };

  const formatted = JSON.stringify(logEntry, null, 2) + ",\n";

  fs.appendFile(logPath, formatted, (err) => {
    if (err) console.error("❌ فشل في كتابة السجل:", err);
  });
};

module.exports = {
  info: (data) => writeLog("info", data),
  warn: (data) => writeLog("warn", data),
  error: (data) => writeLog("error", data),
};
