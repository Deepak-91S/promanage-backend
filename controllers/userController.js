const User = require("../model/user");
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/CustomError");
const cookieToken = require("../utils/cookieToken");
const crypto = require("crypto");

exports.register = BigPromise(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(
      new CustomError("A field is missing, please check all inputs", 400)
    );
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return next(new CustomError("User is already registered", 401));
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  cookieToken(user, res);
});

exports.login = BigPromise(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new CustomError("Please provide email or password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(
      new CustomError("User not registered , please register your account")
    );
  }

  const isCorrectPassword = await user.isValidatePassword(password);

  if (!isCorrectPassword) {
    return next(
      new CustomError("Password is incorrect,provide valid credentials", 401)
    );
  }

  cookieToken(user, res);
});

exports.logout = BigPromise(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logout Success",
  });
});

// exports.changePassword = BigPromise(async (req, res, next) => {
//   const { name, oldPassword, newPassword } = req.body;

//   const user = await User.findById(user._id);
//   if (!user) {
//     return next(new CustomError("User not found", 401));
//   }

//   if (!oldPassword || !newPassword) {
//     return next(
//       new CustomError("Old password and new password are required", 400)
//     );
//   }

//   const isMatch = await user.isValidatePassword(oldPassword);

//   if (!isMatch) {
//     return next(new CustomError("Old password is incorrect", 400));
//   }

//   if (name) {
//     user.name = name;
//   }

//   user.password = newPassword;

//   await user.save();

//   res.status(200).json({
//     success: true,
//     message: "Username and password updated successfully",
//   });
// });

exports.changePassword = BigPromise(async (req, res, next) => {
  const { name, oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new CustomError("User not found", 401));
  }

  if (!oldPassword || !newPassword) {
    return next(
      new CustomError("Old password and new password are required", 400)
    );
  }

  const isMatch = await user.isValidatePassword(oldPassword);

  if (!isMatch) {
    return next(new CustomError("Old password is incorrect", 400));
  }

  if (name) {
    user.name = name;
  }

  user.password = newPassword;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Username and password updated successfully",
  });
});
