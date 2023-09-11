import React, { useState } from "react";
import "./addslot.css";
import { formatDateForServer, getEndDateTimeString } from "../helper/helper";

const AddSlot = ({ selectedDate, onEventAdded }) => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("");
  const [dateTime, setDateTime] = useState(selectedDate.toISOString());

  // ------------------------------------------------ Add Event Logic ------------------------------------------------ //
  const handleAddEvent = async (e) => {
    e.preventDefault();

    try {
      let endDateString = getEndDateTimeString(dateTime, duration);

      console.log(endDateString);

      const eventData = {
        name: name,
        location: location,
        date_start_time: formatDateForServer(dateTime),
        date_end_time: formatDateForServer(endDateString),
      };

      const response = await fetch(`/api/events`, {
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
      // Trigger the refetch after successfully adding an event
      onEventAdded();
    } catch (error) {
      console.error("Error adding the event:", error);
      alert("Failed to add the event. Please try again.");
    }
  };

  // ------------------------------------------------ HTML Render ------------------------------------------------ //
  return (
    <div className="add-slot">
      <h3 className="selectedDateAddSlot">
        Selected: {selectedDate.toDateString()}
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
