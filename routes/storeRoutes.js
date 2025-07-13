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

router.get("/", AuthUser, allowedTO("moderator"), getAllStores);

router.get("/store-status", AuthUser, allowedTO("moderator"), getStoreStats); // ضف هذا السطر

router.get(
  "/:id",
  AuthUser,
  allowedTO("moderator"),
  mongoIdValidator,
  getStoreById
);
router.post(
  "/",
  AuthUser,
  allowedTO("moderator"),
  createStoreValidator,
  createStore
);
router.put(
  "/:id",
  AuthUser,
  allowedTO("moderator"),
  mongoIdValidator,
  createStoreValidator,
  updateStore
);
router.delete(
  "/:id",
  AuthUser,
  allowedTO("moderator"),
  mongoIdValidator,
  deleteStore
);

module.exports = router;
