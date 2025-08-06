const updatePasswordChangedAt = (user) => {
  if (!user.isModified("password")) return;
  user.passwordChangedAt = Date.now();
};

module.exports = updatePasswordChangedAt;
