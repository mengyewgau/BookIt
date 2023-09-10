const express = require("express");
const router = express.Router();
const calendarController = require("../controllers/calendarController");

router.get("/events", calendarController.getEvents);
router.post("/events", calendarController.createEvent);
router.delete("/events", calendarController.deleteEvent);
router.put("/events", calendarController.updateEvent);

module.exports = router;
