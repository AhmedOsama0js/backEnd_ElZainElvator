const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

exports.addRecord = asyncHandler(async (req, res, next) => {
  const { name, email, age, password } = req.body;

  if (!name || !email) {
    return next(new ApiError("⚠️ الاسم والبريد الإلكتروني مطلوبان", 400));
  }

  if (!password) {
    return next(new ApiError("⚠️ كلمة المرور مطلوبة", 400));
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(
      new ApiError(`⚠️ البريد الإلكتروني (${email}) مستخدم من قبل`, 400)
    );
  }

  const newUser = await User.create({ name, email, age, password });
  res
    .status(201)
    .json({ message: "✅ تم إضافة المستخدم بنجاح", data: newUser });
});

exports.updateRecord = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });

  if (!updatedUser) {
    return next(new ApiError(`⚠️ لا يوجد مستخدم بالمعرّف ${id}`, 404));
  }

  res
    .status(200)
    .json({ message: "✅ تم تحديث بيانات المستخدم بنجاح", data: updatedUser });
});

exports.updateMyPassword = asyncHandler(async (req, res, next) => {
  const { newPassword, currentPassword } = req.body;

  const userData = await User.findById(req.user.id);
  if (!userData) {
    return next(new ApiError("⚠️ المستخدم غير موجود", 404));
  }

  const isCorrectPassword = await bcrypt.compare(
    currentPassword,
    userData.password
  );
  if (!isCorrectPassword) {
    return next(new ApiError("⚠️ كلمة المرور الحالية غير صحيحة", 400));
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: hashedPassword,
      passwordChangeAt: new Date(),
    },
    { new: true }
  );

  const token = generateToken(user._id);

  res.status(200).json({
    message: "✅ تم تحديث كلمة المرور بنجاح",
    data: user,
    token,
  });
});
