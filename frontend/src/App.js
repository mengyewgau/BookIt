import React from "react";
import "./App.css";
import logo from "./assets/logo.png";
import Calendar from "./components/Calendar";

function App() {
  return (
    <div className="App">
      <div className="logo-container">
        <img src={logo} alt="BookIt Logo" />
      </div>
      <Calendar></Calendar>
      <h5>
        Book/Reschedule a class with me, view existing classes and time, or pay
        class fees!
      </h5>
      <footer>
        <p>Currently fee payment is not supported</p>
        <p>&copy; Gau Meng Yew</p>
      </footer>
    </div>
  );
}

export default App;
