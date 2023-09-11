// ------------------------------------------------ Helper Functions ------------------------------------------------ //

/**
 * getSingaporeDate
 *
 * Description:
 * Returns the current date and time in Singapore timezone (GMT+8).
 *
 * Parameters:
 * None.
 *
 * Returns:
 * - Date object: A JavaScript `Date` object representing the current date and time in Singapore timezone (GMT+8).
 *
 * Example:
 * const sgDate = getSingaporeDate();
 * console.log(sgDate);  // Outputs: "2023-09-11T14:20:30.000Z" (example value)
 */
export function getSingaporeDate() {
  // Create a new date object
  const now = new Date();

  // Convert the current date to Singapore timezone (GMT+8)
  const singaporeTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Singapore" })
  );

  // Adjust for the timezone difference between UTC and GMT+8
  const offset = singaporeTime.getTime() - now.getTime();

  return new Date(now.getTime() + offset);
}

/**
 * formatDate
 *
 * Description:
 * Formats a given `Date` object into a string in the format "YYYY-MM-DD".
 *
 * Parameters:
 * - d (Date object): A JavaScript `Date` object that you want to format.
 *
 * Returns:
 * - String: A string representing the formatted date in the format "YYYY-MM-DD".
 *
 * Example:
 * const dateObj = new Date('2023-09-11T14:20:30.000Z');
 * const formattedDate = formatDate(dateObj);
 * console.log(formattedDate);  // Outputs: "2023-09-11"
 */
export function formatDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * formatDate
 *
 * Description:
 * Formats a given `Date` object into a string in the format "YYYY-MM-DD".
 *
 * Parameters:
 * - d (Date object): A JavaScript `Date` object that you want to format.
 *
 * Returns:
 * - String: A string representing the formatted date in the format "YYYY-MM-DD".
 *
 * Example:
 * const dateObj = new Date('2023-09-11T14:20:30.000Z');
 * const formattedDate = formatDate(dateObj);
 * console.log(formattedDate);  // Outputs: "2023-09-11"
 */
export function formatDateForServer(dateTime) {
  // Assuming the dateTime format is like "2023-09-02T17:00:00Z"
  const [datePart, timePart] = dateTime.split("T");
  const [year, month, day] = datePart.split("-");
  const [hour, minute] = timePart.split(":");

  const formattedDate = `${day}-${month}-${year.slice(-2)}_${hour}${minute}`;
  return formattedDate;
}

/**
 * getEndDateTimeString
 *
 * Description:
 * Given a start time and a duration, calculates the end time and returns the full date-time string.
 *
 * Parameters:
 * - dateTime (String): A string representing the start time in the format "YYYY-MM-DDTHH:MM".
 * - duration (Number): Duration in hours (can be a decimal, e.g., 1.5 for one and a half hours).
 *
 * Returns:
 * - String: A string representing the end date and time in the format "YYYY-MM-DDTHH:MM".
 *
 * Example:
 * const start = "2023-09-11T10:00";
 * const end = getEndDateTimeString(start, 1.5);
 * console.log(end);  // Outputs: "2023-09-11T11:30"
 */
export function getEndDateTimeString(dateTime, duration) {
  // Derive start time

  // Intermediate string splits
  const parts = dateTime.split("T");
  const date = parts[0];
  const timeString = parts[1];
  const [hours, minutes] = timeString.split(":").map(Number);

  // Calculate end time
  const durationInt = parseInt(duration);
  const additionalHours = Math.floor(durationInt);
  const additionalMinutes = (duration - additionalHours) * 60;

  let newHours = hours + additionalHours;
  let newMinutes = minutes + additionalMinutes;

  if (newMinutes >= 60) {
    newHours += Math.floor(newMinutes / 60);
    newMinutes = newMinutes % 60;
  }

  // Create new Time String
  const endTime = `${newHours.toString().padStart(2, "0")}:${Math.round(
    newMinutes
  )
    .toString()
    .padStart(2, "0")}`;

  return date + "T" + endTime;
}
