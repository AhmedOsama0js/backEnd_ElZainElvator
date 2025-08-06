const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const updatePasswordChangedAt = require("../hooks/updatePasswordChangedAt");
const hashPassword = require("../hooks/hashPassword");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "⚠️ الاسم مطلوب"],
      trim: true,
      minlength: [3, "⚠️ يجب أن يكون الاسم 3 أحرف على الأقل"],
    },
    email: {
      type: String,
      required: [true, "⚠️ البريد الإلكتروني مطلوب"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "⚠️ كلمة المرور مطلوبة"],
      minlength: [6, "⚠️ يجب أن تكون كلمة المرور 6 أحرف على الأقل"],
    },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", hashPassword);
userSchema.pre("save", function (next) {
  updatePasswordChangedAt(this);
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
