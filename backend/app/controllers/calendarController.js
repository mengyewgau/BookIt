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
function currentDateTimeISO() {
  // Get the current date parts
  const date = new Date();
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-11, hence the +1
  const year = date.getFullYear().toString();

  // Get the current time parts
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");

  return `${year}-${month}-${day}T${hour}:${minute}:00+08:00`;
}

exports.getEvents = (req, res) => {
  // ----------- Setting current date ----------- //
  const currentDate = new Date(currentDateTimeISO());

  // ----------- 3 Months Ago From Now ----------- //
  const threeMonthsAgo = new Date(currentDate);
  threeMonthsAgo.setMonth(currentDate.getMonth() - 3);

  // ----------- 6 Months From Now ----------- //
  const sixMonthsFromNow = new Date(currentDate);
  sixMonthsFromNow.setMonth(currentDate.getMonth() + 6);

  calendar.events.list(
    {
      calendarId: process.env.SPECIFIC_CALENDAR_ID,
      timeMin: threeMonthsAgo.toISOString(),
      timeMax: sixMonthsFromNow.toISOString(),
      singleEvents: true, // This will expand recurring events into individual instances
    },
    (err, response) => {
      if (err) {
        console.error("Error fetching events:", err);
        return res.status(500).send("Error fetching events.");
      }
      // console.log("Fetched events:", response.data.items);

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
 *     - date_start_time: {string} The start time of the event, STRICTLY only in custom format like "2-09-23_1700".
 *     - date_end_time: {string} The end time of the event, similar to the start time format.
 *     - location: {string} The location of the event.
 *     Note: The property 'lesson_is_paid' will be sourced from the existing event or set to a default value.
 * @param {Object} res - Express response object.
 *
 * @returns {Object} Response object with details of the created event.
 */
exports.createEvent = (req, res) => {
  console.log("called createEvent in controller");
  const { name, date_start_time, date_end_time, location } = req.body;
  const event = new TuitionEvent(
    name,
    date_start_time,
    date_end_time,
    location,
    false
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
 * Deletes a specified event from the Google Calendar.
 *
 * @function
 * @name deleteEvent
 *
 * @param {Object} req - Express request object containing event details.
 * @property {Object} req.body - The details of the event to be deleted.
 * @property {string} req.body.name - The name/title of the event.
 * @property {string} req.body.location - The location of the event.
 * @property {string} req.body.date_start_time - The start time of the event. Must adhere to the format "dd-mm-yy_hhmm", e.g., "2-09-23_1700".
 *
 * @param {Object} res - Express response object for sending back the results.
 *
 * @returns {Object} An Express response object. If successful, it contains a message confirming the deletion of the event. In case of errors, it contains the corresponding error message.
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
          event.start.dateTime === formatDateToISO(date_start_time)
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
 * Updates a specific event's description in the Google Calendar based on provided criteria.
 *
 * @function
 * @name updateEvent
 *
 * @param {Object} req - Express request object containing event update details.
 * @property {Object} req.body - The details of the event to be updated.
 * @property {string} req.body.name - The name/title of the event.
 * @property {string} req.body.location - The location where the event will take place.
 * @property {string} req.body.date_start_time - The start time of the event, formatted as "dd-mm-yy_hhmm", e.g., "2-09-23_1700".
 * @note The end time of the event and the status of whether the lesson is paid will be derived from the existing event in the calendar.
 *
 * @param {Object} res - Express response object for sending back the results.
 *
 * @returns {Object} An Express response object. If successful, it contains details of the updated event. In case of errors, it contains the corresponding error message.
 */

exports.updateEvent = (req, res) => {
  const { name, location, date_start_time } = req.body;

  // Calculate the time range: 24 hours backward and 24 hours forward
  const now = new Date();
  const timeMin = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(); // Subtracting 24 hours
  const timeMax = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(); // Adding 24 hours

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
          event.start.dateTime === formatDateToISO(date_start_time)
        );
      });

      if (!eventToUpdate) {
        return res.status(404).send({ message: "Event not found." });
      }
      console.log("Retrieval Successful");
      console.log(eventToUpdate.end.dateTime);
      // Update the found event
      const updatedEvent = new TuitionEvent(
        name,
        eventToUpdate.start.dateTime,
        eventToUpdate.end.dateTime,
        location,
        true
      );
      console.log("Update Started");
      console.log(updatedEvent);
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

      console.log("Update Successful");
    }
  );
};

/** CAN BE IGNORED
 * Helper function that converts a custom date-time string into its ISO format with a timezone offset of +08:00.
 *
 * @function
 * @name formatDateToISO
 *
 * @param {string} date_str - The custom date-time string formatted as "dd-mm-yy_hhmm", e.g., "2-09-23_1700".
 *
 * @returns {string} The date-time in ISO format with a timezone offset of +08:00.
 */
function formatDateToISO(date_str) {
  // Convert date string "2-09-23_1700" to ISO format
  const [date, time] = date_str.split("_");
  const [day, month, year] = date.split("-");
  const hour = time.substring(0, 2);
  const minute = time.substring(2);
  return `20${year}-${month}-${day}T${hour}:${minute}:00+08:00`;
}
