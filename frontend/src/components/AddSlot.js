import React from "react";

function AddSlot({ selectedDate, onClose, onSubmit, timeOptions }) {
  const [formData, setFormData] = React.useState({
    name: "",
    startTime: "",
    duration: "",
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="form-popup">
      <h4>Add Slot</h4>
      <form onSubmit={handleFormSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Child/Parent e.g. John/Samantha"
          />
        </label>
        <label>
          Date:
          <input type="text" value={selectedDate} disabled />
        </label>
        <label>
          Start Time:
          <select
            value={formData.startTime}
            onChange={(e) =>
              setFormData({ ...formData, startTime: e.target.value })
            }
          >
            {timeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </label>
        <label>
          Duration (hours):
          <input
            type="number"
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: e.target.value })
            }
            min="1"
          />
        </label>
        <button type="submit">Submit</button>
        <button onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
}

export default AddSlot;
