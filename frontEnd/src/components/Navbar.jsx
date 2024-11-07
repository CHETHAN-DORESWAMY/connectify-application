import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="https://via.placeholder.com/40" alt="App Icon" />
        <h1>My Application</h1>
      </div>
      <div>
        <Link to="/register">Register</Link>
      </div>
    </nav>
  );
}

export default Navbar;
