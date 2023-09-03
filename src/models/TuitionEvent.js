class TuitionEvent {
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

  toGoogleCalendarEvent() {
    return {
      summary: this.name,
      location: this.location,
      description: this.lesson_is_paid ? "Paid" : "Unpaid",
      start: {
        dateTime: this.formatDateToISO(this.date_start_time),
        timeZone: "Asia/Singapore",
      },
      end: {
        dateTime: this.formatDateToISO(this.date_end_time),
        timeZone: "Asia/Singapore",
      },
    };
  }

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
