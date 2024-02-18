const express = require("express");
require("dotenv").config();
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

//morgan import
app.use(morgan("tiny"));

//Regular middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Routes import
const home = require("./routes/home");
const user = require("./routes/user");

//Router middleware
app.use("/api/v1/", home);
app.use("/api/v1/", user);

module.exports = app;
