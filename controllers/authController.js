const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendResetCode = require("../utils/sendEmail");
const crypto = require("crypto");

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ApiError("⚠️ البريد الإلكتروني وكلمة المرور مطلوبان", 400));
  }

  const foundUser = await User.findOne({ email });

  const isPasswordValid =
    foundUser && (await bcrypt.compare(password, foundUser.password));

  if (!isPasswordValid) {
    return next(
      new ApiError("❌ البريد الإلكتروني أو كلمة المرور غير صحيحة", 401)
    );
  }

  const token = generateToken(foundUser._id);

  res.status(200).json({ user: foundUser, token });
});

exports.getMe = asyncHandler(async (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      new ApiError("⚠️ أنت غير مسجل الدخول. الرجاء تسجيل الدخول أولاً.", 401)
    );
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    return next(
      new ApiError("⚠️ التوكن غير صالح. الرجاء تسجيل الدخول مرة أخرى.", 401)
    );
  }

  const user = await User.findById(decoded.userId).select("-Password");

  if (!user) {
    return next(new ApiError("❌ لم يتم العثور على المستخدم", 404));
  }

  if (user.passwordChangeAt) {
    const passwordChangedAt = parseInt(
      new Date(user.passwordChangeAt).getTime() / 1000,
      10
    );
    if (passwordChangedAt > decoded.iat) {
      return next(
        new ApiError(
          "⚠️ تم تغيير كلمة المرور مؤخرًا. الرجاء تسجيل الدخول مجددًا.",
          401
        )
      );
    }
  }

  res.status(200).json({ message: "successful ✅", user });
});

exports.AuthUser = asyncHandler(async (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return next(
      new ApiError("⚠️ لم تقم بتسجيل الدخول. الرجاء تسجيل الدخول أولاً", 401)
    );
  }

  const token = authHeader.replace("Bearer ", "");
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    return next(
      new ApiError(
        "⚠️ التوكن غير صالح أو منتهي. الرجاء تسجيل الدخول مرة أخرى",
        401
      )
    );
  }

  const user = await User.findById(decoded.userId);

  if (!user) {
    return next(new ApiError("⚠️ المستخدم غير موجود", 404));
  }

  if (user.passwordChangeAt) {
    const passwordChangedTime = parseInt(
      user.passwordChangeAt.getTime() / 1000,
      10
    );
    if (passwordChangedTime > decoded.iat) {
      return next(
        new ApiError(
          "⚠️ انتهت صلاحية التوكن. الرجاء تسجيل الدخول مرة أخرى",
          401
        )
      );
    }
  }

  req.user = user;
  next();
});

exports.allowedTO = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return next(
        new ApiError(`🚷 صلاحيات مرفوضة!  غير مسموح له بالوصول`, 403)
      );
    }
    next();
  });

exports.forgotPasswordSendEmail = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ApiError("⚠️ لا يوجد مستخدم بهذا البريد الإلكتروني", 404));
  }

  const resetToken = Math.floor(100000 + Math.random() * 900000).toString();

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  try {
    await sendResetCode(user.email, resetToken);

    // إرسال رد بالنجاح
    res.status(200).json({
      status: "success",
      message: "✅ تم إرسال رمز إعادة تعيين كلمة المرور إلى بريدك الإلكتروني",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new ApiError("⚠️ فشل إرسال البريد الإلكتروني، حاول مرة أخرى لاحقًا", 500)
    );
  }
});

exports.resetNewPassword = asyncHandler(async (req, res, next) => {
  const { email, resetCode, newPassword } = req.body;

  if (!email || !resetCode || !newPassword) {
    return next(
      new ApiError("⚠️ البريد الإلكتروني، الرمز، وكلمة المرور مطلوبة", 400)
    );
  }

  const hashedResetToken = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  const user = await User.findOne({
    email,
    passwordResetToken: hashedResetToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError("⚠️ الرمز غير صحيح أو منتهي الصلاحية", 400));
  }

  user.password = newPassword;
  user.passwordChangeAt = new Date();
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "✅ تم تعيين كلمة المرور الجديدة بنجاح",
  });
});
