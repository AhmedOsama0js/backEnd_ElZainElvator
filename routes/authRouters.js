const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const {
  getMe,
  login,
  AuthUser,
  forgotPasswordSendEmail,
  resetNewPassword,
} = require("../controllers/authController");
const { updateMyPassword } = require("../controllers/userController");
const {
  loginValidator,
  updateUserPasswordValidator,
  resetPasswordValidator,
} = require("../utils/validators/authValidator");

const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  message: "⛔ تم حظرك مؤقتًا. الرجاء المحاولة مرة أخرى بعد 5 دقائق.",
  handler: (req, res, next) => {
    res.status(429).send({
      message:
        "⛔ لقد قمت بعدد كبير من محاولات تسجيل الدخول. الرجاء الانتظار 5 دقائق ثم المحاولة مجددًا.",
    });
  },
});

router.post("/login", loginLimiter, loginValidator, login);
router.get("/getMe", AuthUser, getMe);
router.put(
  "/updatePassword",
  AuthUser,
  updateUserPasswordValidator,
  updateMyPassword
);
router.post("/sendEmail", forgotPasswordSendEmail);
router.post("/SetNewData", resetPasswordValidator, resetNewPassword);

module.exports = router;
