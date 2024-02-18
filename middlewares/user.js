const User = require("../model/user");
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/CustomError");
const jwt = require("jsonwebtoken");

exports.isLoggedIn = BigPromise(async (req, res, next) => {
  let token = req.cookies.token;

  //if token not found in cookies , check if header contains auth field
  if (!token && req.header("Authorization")) {
    token = req.header("Authorization").replace("Bearer ", "");
  }

  if (!token) {
    return next(new CustomError("Token is not present", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return next(new CustomError("Invalid or expired token", 401));
  }
});
