const User = require("../model/user");
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/CustomError");
const cookieToken = require("../utils/cookieToken");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = BigPromise(async (req, res, next) => {
  try {
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
  } catch (error) {
    console.error(error);
    return next(new CustomError("Internal Server Error", 500));
  }
});

exports.login = BigPromise(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new CustomError("Please provide email and password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new CustomError("User not found", 401));
    }

    const isCorrectPassword = await user.isValidatePassword(password);

    if (!isCorrectPassword) {
      return next(new CustomError("Password is incorrect", 401));
    }

    cookieToken(user, res);
  } catch (error) {
    console.error(error);
    return next(new CustomError("Internal Server Error", 500));
  }
});

exports.logout = BigPromise(async (req, res, next) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "Logout Success",
    });
  } catch (error) {
    console.error(error);
    return next(new CustomError("Internal Server Error", 500));
  }
});

exports.changePassword = BigPromise(async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("+password");

    if (!user) {
      return next(new CustomError("User not found", 400));
    }

    const verified = await bcrypt.compare(req.body.oldPassword, user.password);

    if (!verified) {
      return next(new CustomError("Invalid current password", 400));
    }

    user.password = req.body.newPassword;

    await user.save();

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(200).json({
      status: "Success",
      message: "Username or password updated successfully",
      results: { jwtToken },
    });
  } catch (error) {
    console.error(error);
    return next(new CustomError("Internal Server Error", 500));
  }
});
