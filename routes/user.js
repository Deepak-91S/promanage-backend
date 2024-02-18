const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
  changePassword,
} = require("../controllers/userController");

//Middleware import
const { isLoggedIn } = require("../middlewares/user");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/changepassword").put(isLoggedIn, changePassword);

module.exports = router;
