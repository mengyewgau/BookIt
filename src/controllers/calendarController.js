const { calendar } = require("../utils/googleAuth");
const TuitionEvent = require("../models/TuitionEvent");

/**
 * getEvents - Retrieves all events from the Google Calendar.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 *
 * @returns {Object} Response object containing a list of events from the Google Calendar.
 */
exports.getEvents = (req, res) => {
  calendar.events.list(
    {
      calendarId: process.env.SPECIFIC_CALENDAR_ID,
    },
    (err, response) => {
      if (err) {
        console.error("Error fetching events:", err);
        return;
      }
      console.log("Fetched events:", response.data.items);

      return res.status(200).send(response.data);
    }
  );
};

/**
 * createEvent - Adds a new event to the Google Calendar.
 *
 * @param {Object} req - Express request object. Expected properties:
 *   - body:
 *     - name: {string} The name of the event.
 *     - date_start_time: {string} The start time of the event in the format "dd-mm-yy_hhmm".
 *     - date_end_time: {string} The end time of the event in the format "dd-mm-yy_hhmm".
 *     - location: {string} The location of the event.
 *     - lesson_is_paid: {boolean} Indicates if the lesson is paid or not.
 * @param {Object} res - Express response object.
 *
 * @returns {Object} Response object with details of the created event.
 */
exports.createEvent = (req, res) => {
  console.log("called createEvent in controller");
  const { name, date_start_time, date_end_time, location, lesson_is_paid } =
    req.body;
  const event = new TuitionEvent(
    name,
    date_start_time,
    date_end_time,
    location,
    lesson_is_paid
  );

  calendar.events.insert(
    {
      calendarId: process.env.SPECIFIC_CALENDAR_ID,
      resource: event.toGoogleCalendarEvent(),
    },
    (err, event) => {
      if (err) return res.status(500).send(err);
      return res.status(200).send(event.data);
    }
  );
};

/**
 * deleteEvent - Deletes an event from the Google Calendar.
 *
 * @param {Object} req - Express request object. Expected properties:
 *   - body:
 *     - name: {string} The name of the event.
 *     - location: {string} The location of the event.
 *     - date_start_time: {string} The start time of the event in ISO format.
 * @param {Object} res - Express response object.
 *
 * @returns {Object} Response object with a message indicating deletion status.
 */

exports.deleteEvent = (req, res) => {
  console.log("deleteEvent function triggered!");
  const { name, location, date_start_time } = req.body;

  // Calculate the time range: 12 hours backward and 36 hours forward
  const now = new Date();
  const timeMin = new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString();
  const timeMax = new Date(now.getTime() + 36 * 60 * 60 * 1000).toISOString();

  // Retrieve events within the specified time range
  calendar.events.list(
    {
      calendarId: process.env.SPECIFIC_CALENDAR_ID,
      timeMin: timeMin,
      timeMax: timeMax,
    },
    (err, response) => {
      if (err) {
        console.error("Error fetching events:", err);
        return res.status(500).send({ message: "Error fetching events." });
      }

      if (!response.data || !response.data.items) {
        console.error("No events fetched or unexpected response structure.");
        return res.status(500).send({ message: "Failed to retrieve events." });
      }

      console.log("Fetched events for deletion:", response.data.items.length);

      const eventToDelete = response.data.items.find((event) => {
        return (
          event.summary === name &&
          event.location === location &&
          event.start.dateTime === date_start_time
        );
      });

      if (!eventToDelete) {
        console.error("No matching event found for deletion criteria.");
        return res.status(404).send({ message: "Event not found." });
      }

      console.log("Event to delete:", eventToDelete);

      // Delete the found event
      calendar.events.delete(
        {
          calendarId: process.env.SPECIFIC_CALENDAR_ID,
          eventId: eventToDelete.id,
        },
        (deleteErr) => {
          if (deleteErr) {
            console.error("Error deleting event:", deleteErr);
            return res.status(500).send(deleteErr);
          }
          console.log("Event deleted successfully.");
          return res
            .status(200)
            .send({ message: "Event deleted successfully" });
        }
      );
    }
  );
};

/**
 * updateEvent - Updates the description of an event in the Google Calendar.
 *
 * @param {Object} req - Express request object. Expected properties:
 *   - body:
 *     - name: {string} The name of the event.
 *     - location: {string} The location of the event.
 *     - date_start_time: {string} The start time of the event in ISO format.
 *     - date_end_time: {string} The end time of the event in ISO format.
 *     - lesson_is_paid: {boolean} Indicates if the lesson is paid or not.
 * @param {Object} res - Express response object.
 *
 * @returns {Object} Response object with details of the updated event.
 */

exports.updateEvent = (req, res) => {
  const { name, location, date_start_time } = req.body;

  // Calculate the time range: 12 hours backward and 36 hours forward
  const now = new Date();
  const timeMin = new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(); // Subtracting 12 hours
  const timeMax = new Date(now.getTime() + 36 * 60 * 60 * 1000).toISOString(); // Adding 36 hours

  // Retrieve events within the specified time range
  calendar.events.list(
    {
      calendarId: process.env.SPECIFIC_CALENDAR_ID,
      timeMin: timeMin,
      timeMax: timeMax,
    },
    (err, response) => {
      if (err) {
        console.error("Error fetching events:", err);
        return res.status(500).send({ message: "Error fetching events." });
      }

      const eventToUpdate = response.data.items.find((event) => {
        return (
          event.summary === name &&
          event.location === location &&
          event.start.dateTime === date_start_time
        );
      });

      if (!eventToUpdate) {
        return res.status(404).send({ message: "Event not found." });
      }

      // Update the found event
      const updatedEvent = new TuitionEvent(
        name,
        date_start_time,
        req.body.date_end_time,
        location,
        req.body.lesson_is_paid
      );

      calendar.events.update(
        {
          calendarId: process.env.SPECIFIC_CALENDAR_ID,
          eventId: eventToUpdate.id,
          resource: updatedEvent.toGoogleCalendarEvent(),
        },
        (err, event) => {
          if (err) return res.status(500).send(err);
          return res.status(200).send(event.data);
        }
      );
    }
  );
};
