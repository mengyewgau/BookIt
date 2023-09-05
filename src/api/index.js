const express = require("express");
const calendarRoutes = require("../routes/calendarRoutes");

const router = express.Router();

// Mount the calendar routes
router.use("/calendar", calendarRoutes);

module.exports = router;
