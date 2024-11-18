import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Signin from "./components/Signin";
import Dashboard from "./components/Dashboard";
import "bootstrap/dist/css/bootstrap.min.css";

// import "./App.css";
import "./index.css";
import Welcome from "./components/Welcome";
import Home from "./components/Home";
import ParticipantSearch from "./components/ParticipantSearch";
import UpdatedAlgorithmCreateMeeting from "./components/UpdatedAlgorithmCreateMeeting";
import Profile from "./components/Profile";
import ResetPassword from "./components/ResetPassword";
import Calendar from "./components/Calendar";

import ChatApp from "./components/ChatComponent";
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/create-meeting"
            element={<UpdatedAlgorithmCreateMeeting />}
          />
          <Route path="/profile/:empId" element={<Profile />} />
          <Route path="/search" element={<ParticipantSearch />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/chat" element={<ChatApp />} />
        </Routes>
      </div>
    </Router>
  );
}

const SignIn = () => (
  <div className="center-content">
    <h2>Sign In Page (Under Construction)</h2>
  </div>
);

export default App;
