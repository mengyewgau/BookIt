import React from "react";
import AddSlot from "./AddSlot";

const ModifyClass = () => {
  const timeOptions = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM"]; // Example time options

  const [date, setDate] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [showOptions, setShowOptions] = React.useState(false);
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [showAddSlotForm, setShowAddSlotForm] = React.useState(false);

  const onChange = (newDate) => {
    setDate(newDate);
    setSelectedDate(newDate);
    setShowOptions(true);
  };

  const addSlot = () => {
    setShowOptions(false);
    setShowAddSlotForm(true);
  };

  const handleAddSlotSubmit = (formData) => {
    console.log(formData);
    // Here, you can process the form data (e.g., send to an API)
  };

  const markNotAttended = () => {
    setShowOptions(false);
    setShowConfirmation(true);
  };

  const confirmNotAttended = () => {
    console.log(`Mark ${selectedDate} as not attended`);
    setShowConfirmation(false);
  };
  return (
    <div>
      {showOptions && (
        <div className="options">
          <button onClick={addSlot}>Add Slot</button>
          <button onClick={markNotAttended}>Did not Attend</button>
          <button onClick={() => setShowOptions(false)}>Cancel</button>
        </div>
      )}
      {showAddSlotForm && (
        <AddSlot
          selectedDate={selectedDate}
          onClose={() => setShowAddSlotForm(false)}
          onSubmit={handleAddSlotSubmit}
          timeOptions={timeOptions}
        />
      )}
      {showConfirmation && (
        <div className="confirmation">
          <p>
            Are you sure you want to mark this date as not attended? This action
            is irreversible.
          </p>
          <button onClick={confirmNotAttended}>Yes, Confirm</button>
          <button onClick={() => setShowConfirmation(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};
