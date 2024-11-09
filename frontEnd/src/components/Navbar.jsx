import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 shadow-md">
      {/* Logo and App Name */}
      <div className="flex items-center">
        <img src="./Preview.png" alt="App Icon" className="h-8 mr-3" />
        <h1 className="text-white text-2xl font-bold">Connectify</h1>
      </div>

      {/* Navbar Links */}
      <div className="hidden md:flex ml-auto space-x-6">
        <ul className="flex items-center space-x-6">
          <li>
            <Link
              className="text-white hover:text-blue-400 transition duration-300"
              to="/schedule-meeting"
            >
              Schedule Meeting
            </Link>
          </li>
          <li>
            <Link
              className="text-white hover:text-blue-400 transition duration-300"
              to="/calendar"
            >
              Calendar
            </Link>
          </li>
          <li>
            <Link
              className="text-white hover:text-blue-400 transition duration-300"
              to="/search"
            >
              Search People
            </Link>
          </li>
          <li>
            <Link
              className="text-white hover:text-blue-400 transition duration-300"
              to="/register"
            >
              Register
            </Link>
          </li>
        </ul>
      </div>

      {/* Mobile View Toggle */}
      <div className="md:hidden flex items-center ml-auto">
        <button className="text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
