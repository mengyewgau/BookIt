import React from "react";
import "./tuitionslot.css";

const TuitionSlot = ({ event }) => {
  // ------------------------------------------------ Delete Event Logic ------------------------------------------------ //
  const handleDeleteEvent = async () => {
    try {
      // Extract necessary details from the event
      const eventData = {
        name: event.summary, // assuming event.summary is the name/title of the event
        location: event.location, // using the location property from the event object
        date_start_time: formatDateForServer(event.start.dateTime), // format the date and time as specified
      };

      const response = await fetch(`http://localhost:4000/api/events`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error("Failed to delete event.");
      }

      const result = await response.json();

      alert(result.message || "Event deleted successfully.");
    } catch (error) {
      console.error("Error deleting the event:", error);
      alert("Failed to delete the event. Please try again.");
    }
  };
  // Helper function to format date and time as "dd-mm-yy_hhmm"
  function formatDateForServer(dateTime) {
    // Assuming the dateTime format is like "2023-09-02T17:00:00Z"
    const [datePart, timePart] = dateTime.split("T");
    const [year, month, day] = datePart.split("-");
    const [hour, minute] = timePart.split(":");

    const formattedDate = `${day}-${month}-${year.slice(-2)}_${hour}${minute}`;
    return formattedDate;
  }

  // ------------------------------------------------ Date Parsing ------------------------------------------------ //
  // Parse the date and time from the Google Calendar format
  const parseDateAndTime = (dateTime) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  };

  const startDateInfo = parseDateAndTime(event.start.dateTime);

  // Calculate duration in hours
  const duration =
    (new Date(event.end.dateTime) - new Date(event.start.dateTime)) /
    (1000 * 60 * 60);
  // console.log(event.start.dateTime);

  // ------------------------------------------------ HTML Render ------------------------------------------------ //
  return (
    <div className="tuition-slot">
      <div>Class: {event.summary}</div>
      <div>Time: {startDateInfo.time}</div>
      <div>Duration: {duration} hour(s)</div>
      <button className="modifyButton" onClick={handleDeleteEvent}>
        Did not attend
      </button>
    </div>
  );
};

export default TuitionSlot;
