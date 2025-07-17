const express = require("express");
const router = express.Router();
const {
  getAllStores,
  getStoreById,
  createStore,
  updateStore,
  deleteStore,
  getStoreStats,
} = require("../controllers/storeController");

const { mongoIdValidator } = require("../utils/validators/mongoIdValidator");
const { createStoreValidator } = require("../utils/validators/storeValidator");
const { AuthUser, allowedTO } = require("../controllers/authController");

router.use(AuthUser, allowedTO("moderator"));

router.get("/", getAllStores);

router.get("/store-status", getStoreStats);

router.get("/:id", mongoIdValidator, getStoreById);
router.post("/", createStoreValidator, createStore);
router.put("/:id", mongoIdValidator, createStoreValidator, updateStore);
router.delete("/:id", mongoIdValidator, deleteStore);

module.exports = router;
