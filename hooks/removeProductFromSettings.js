const Settings = require("../models/Settings");

const removeProductFromSettings = async (storeId) => {
  try {
    await Settings.updateMany(
      {},
      {
        $pull: {
          stage1: { product: storeId },
          stage2: { product: storeId },
          stage3: { product: storeId },
        },
      }
    );
  } catch (error) {
    console.error("❌ Error removing product from settings:", error);
    throw error;
  }
};

module.exports = removeProductFromSettings;
