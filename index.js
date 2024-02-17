const express = require("express");
require("dotenv").config();
const app = express();
const morgan = require("morgan");

app.use(morgan("tiny"));

module.exports = app;
