import React, { useState } from "react";
import "./addslot.css";

const AddSlot = ({ selectedDate }) => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("");
  const [dateTime, setDateTime] = useState(
    selectedDate.toISOString().split("T")[0]
  );
  const { formatDateForServer } = require("../helper/helper");

  // ------------------------------------------------ Add Event Logic ------------------------------------------------ //
  const handleAddEvent = async (e) => {
    e.preventDefault();

    try {
      const startDate = new Date(dateTime); // Convert the dateTime string into a Date object
      const endDate = new Date(startDate.getTime() + duration * 60 * 60 * 1000); // Calculate the end time based on the duration

      console.log("Start Date:", startDate.toString()); // Debugging
      console.log("End Date:", endDate.toString()); // Debugging

      const eventData = {
        name: name,
        location: location,
        date_start_time: formatDateForServer(startDate),
        date_end_time: formatDateForServer(endDate),
      };

      console.log(eventData.date_start_time);

      const response = await fetch(`http://localhost:4000/api/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error("Failed to add event.");
      }

      const result = await response.json();
      alert(result.message || "Event added successfully.");
    } catch (error) {
      console.error("Error adding the event:", error);
      alert("Failed to add the event. Please try again.");
    }
  };

  // ------------------------------------------------ HTML Render ------------------------------------------------ //
  return (
    <div className="tuition-slot">
      <h3 className="selectedDateAddSlot">
        Selected Date: {selectedDate.toDateString()}
      </h3>{" "}
      <form onSubmit={handleAddEvent}>
        <div>
          <label>Class:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Student/Parent e.g. Samuel/Emily"
            required
          />
        </div>
        <div>
          <label>MRT/LRT:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Kangkar LRT"
            required
          />
        </div>
        <div>
          <label>Time:</label>
          <input
            type="time"
            value={dateTime.split("T")[1] || ""}
            onChange={(e) =>
              setDateTime(
                `${selectedDate.toISOString().split("T")[0]}T${e.target.value}`
              )
            }
            required
          />
        </div>

        <div>
          <label>Duration (hours):</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Only Numbers e.g. 1.5"
            min="1" // minimum value
            step="0.5" // increment steps, so 0.5 for half hours
            required
          />
        </div>
        <button type="submit" className="addButton">
          Add Slot
        </button>
      </form>
    </div>
  );
};

export default AddSlot;
