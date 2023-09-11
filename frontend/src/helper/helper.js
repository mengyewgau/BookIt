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
function getSingaporeDate() {
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
function formatDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")}`;
}

// Helper function to format date and time as "dd-mm-yy_hhmm"
function formatDateForServer(dateObj) {
  const year = dateObj.getFullYear().toString().slice(-2);
  const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // months are 0-based in JS
  const day = String(dateObj.getDate()).padStart(2, "0");
  const hour = String(dateObj.getHours()).padStart(2, "0");
  const minute = String(dateObj.getMinutes()).padStart(2, "0");

  return `${day}-${month}-${year}_${hour}${minute}`;
}

module.exports = {
  getSingaporeDate,
  formatDate,
  formatDateForServer,
};
