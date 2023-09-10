/**
 * Represents a tuition event with properties and methods to manage the event.
 */
class TuitionEvent {
  /**
   * Initializes a new instance of the TuitionEvent class.
   *
   * @param {string} name - The name of the tuition event.
   * @param {string} date_start_time - The start time of the event, either in ISO format or custom format like "2-09-23_1700".
   * @param {string} date_end_time - The end time of the event, similar to the start time format.
   * @param {string} location - The location of the event.
   * @param {boolean} lesson_is_paid - Indicates whether the tuition lesson is paid or not.
   */
  constructor(name, date_start_time, date_end_time, location, lesson_is_paid) {
    this.name = name;
    this.date_start_time = date_start_time;
    this.date_end_time = date_end_time;
    this.location = location;
    this.lesson_is_paid = lesson_is_paid;
    console.log(
      "Constructor values:",
      name,
      date_start_time,
      date_end_time,
      location,
      lesson_is_paid
    );
  }
  /**
   * Converts the instance properties to a format suitable for Google Calendar events.
   *
   * @returns {Object} An object containing properties formatted for a Google Calendar event.
   */
  toGoogleCalendarEvent() {
    // Check if a date string is in ISO format
    const isISOFormat = (dateStr) => {
      const isoFormatRegex =
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\+\d{2}:\d{2})?$/;
      return isoFormatRegex.test(dateStr);
    };
    // Convert to ISO format if it's not already
    const getISODate = (dateStr) => {
      return isISOFormat(dateStr) ? dateStr : this.formatDateToISO(dateStr);
    };

    return {
      summary: this.name,
      location: this.location,
      description: this.lesson_is_paid ? "Paid" : "Unpaid",
      start: {
        dateTime: getISODate(this.date_start_time),
        timeZone: "Asia/Singapore",
      },
      end: {
        dateTime: getISODate(this.date_end_time),
        timeZone: "Asia/Singapore",
      },
    };
  }
  /**
   * Converts a custom date format like "2-09-23_1700" to ISO format.
   *
   * @param {string} date_str - The date string in the custom format.
   * @returns {string} The date string in ISO format.
   */
  formatDateToISO(date_str) {
    // Convert date string "2-09-23_1700" to ISO format
    const [date, time] = date_str.split("_");
    const [day, month, year] = date.split("-");
    const hour = time.substring(0, 2);
    const minute = time.substring(2);
    return `20${year}-${month}-${day}T${hour}:${minute}:00`;
  }
}

module.exports = TuitionEvent;
