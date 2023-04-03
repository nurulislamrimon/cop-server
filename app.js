// external import
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
// internal import

// middlewares
app.use(express.json());
app.use(cors());

module.exports = app;
