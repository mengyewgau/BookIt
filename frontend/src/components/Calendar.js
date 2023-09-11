import React, { useEffect, useState } from "react";
import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar.css";
import TuitionSlot from "./TuitionSlot";
import AddSlot from "./AddSlot";

const Calendar = () => {
  const [date, setDate] = useState(new Date());
  const [allEvents, setAllEvents] = useState([]);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const { getSingaporeDate, formatDate } = require("../helper/helper");

  // ------------------------------------------------ Retrieve Events ------------------------------------------------ //
  const fetchEvents = () => {
    fetch("http://localhost:4000/api/events")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch events from server.");
        }
        return response.json();
      })
      .then((data) => {
        // Access the 'items' property from the API response
        const events = data.items;

        if (Array.isArray(events)) {
          // --------------- Current Date --------------- //
          const today = getSingaporeDate();
          const start_date = new Date(today);
          // --------------- Converted Date --------------- //
          start_date.setMonth(today.getMonth() - 2);
          const end_date = new Date(today);
          end_date.setMonth(today.getMonth() + 4);

          // --------------- Filtering Events --------------- //
          const filteredEvents = events.filter((event) => {
            // If the event has a status of "cancelled", ignore it
            if (event.status === "cancelled") {
              return false;
            }

            if (event.start && event.start.dateTime) {
              const eventDate = new Date(event.start.dateTime);
              return start_date <= eventDate && eventDate <= end_date;
            }
            return false;
          });

          setAllEvents(filteredEvents);
        } else {
          console.error("Events data is not an array or doesn't exist:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  };

  useEffect(() => {
    fetchEvents(); // Initial fetch
  }, []);

  // ------------------------------------------------ Select Events ------------------------------------------------ //
  const onChange = (newDate) => {
    setDate(newDate);
    allEvents.forEach((event) => {
      if (!event.start || !event.start.dateTime) {
        console.warn("Missing start.dateTime for event:", event);
      } else if (isNaN(new Date(event.start.dateTime).getTime())) {
        console.warn("Invalid start.dateTime for event:", event.start.dateTime);
      }
    });

    const selectedEvents = allEvents
      .filter((event) => {
        if (
          event.start &&
          event.start.dateTime &&
          !isNaN(new Date(event.start.dateTime).getTime())
        ) {
          return (
            formatDate(new Date(event.start.dateTime)) === formatDate(newDate)
          );
        }
        return false;
      })
      .sort((a, b) => new Date(a.start.dateTime) - new Date(b.start.dateTime)); // Sorting by start time

    setSelectedDateEvents(selectedEvents);
  };
  // ------------------------------------------------ Handle Deleted Events ------------------------------------------------ //

  const handleEventDeleted = (deletedEventId) => {
    const updatedAllEvents = allEvents.filter(
      (event) => event.id !== deletedEventId
    );
    const updatedSelectedDateEvents = selectedDateEvents.filter(
      (event) => event.id !== deletedEventId
    );

    setAllEvents(updatedAllEvents);
    setSelectedDateEvents(updatedSelectedDateEvents);
  };

  // ------------------------------------------------ HTML Render ------------------------------------------------ //
  return (
    <div style={{ display: "flex" }}>
      <AddSlot selectedDate={date} onEventAdded={fetchEvents} />
      <ReactCalendar onChange={onChange} value={date} />
      <div className="options">
        <div className="selectedDate">Date: {date.toDateString()}</div>
        {selectedDateEvents.length > 0 ? (
          selectedDateEvents.map((event) => (
            <TuitionSlot
              key={event.id}
              event={event}
              onDeleted={handleEventDeleted}
            />
          ))
        ) : (
          <div>Currently Empty! Book a slot!</div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
