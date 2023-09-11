import React from "react";
import "./tuitionslot.css";
import { formatDateForServer } from "../helper/helper";
const TuitionSlot = ({ event, onDeleted }) => {
  // ------------------------------------------------ Delete Event Logic ------------------------------------------------ //
  const handleDeleteEvent = async () => {
    // Display confirmation popup
    const userConfirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    // If the user clicks "Cancel", exit the function without deleting
    if (!userConfirmed) return;

    try {
      // Extract necessary details from the event
      const eventData = {
        name: event.summary, // assuming event.summary is the name/title of the event
        location: event.location, // using the location property from the event object
        date_start_time: formatDateForServer(event.start.dateTime), // format the date and time as specified
      };

      const response = await fetch(`/api/events`, {
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
      // Inform the parent component that the event has been deleted.
      onDeleted(event.id);
    } catch (error) {
      console.error("Error deleting the event:", error);
      alert("Failed to delete the event. Please try again.");
    }
  };

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
