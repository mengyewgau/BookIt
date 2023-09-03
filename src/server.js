require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

const bodyParser = require("body-parser");
const calendarRoutes = require("./routes/calendarRoutes");
const { handleOAuth2Callback } = require("./middleware/authMiddleware");

const app = express();

// Create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(bodyParser.json());
app.use("/api", calendarRoutes);
app.get("/oauth2callback", handleOAuth2Callback);

// Use morgan to log requests to a file
app.use(morgan("combined", { stream: accessLogStream }));

module.exports = app;
