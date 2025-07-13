// config/initProjectSettings.js
const Settings = require("../models/Settings");

const initProjectSettings = async () => {
  const settingsCount = await Settings.countDocuments();

  if (settingsCount === 0) {
    console.log("🔧 جاري إنشاء إعدادات المراحل الافتراضية...");

    const defaultSettings = new Settings({
      stage1Products: [],
      stage2Products: [],
      stage3Products: [],
    });

    await defaultSettings.save();
  }
};

module.exports = initProjectSettings;
