import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Signin from "./components/Signin";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/signin" element={<Signin />} />

          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
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
