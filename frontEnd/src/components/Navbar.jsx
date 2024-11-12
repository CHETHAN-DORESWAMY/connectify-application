import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-black p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo and App Name */}
        <div className="flex items-center space-x-3">
          <img src="https://th.bing.com/th?id=OIP.OQPmorjMA98lRVYZXXHJYAHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2" alt="App Icon" className="h-10 w-10 rounded-full shadow-md" />
          <h1 className="text-white text-3xl font-bold tracking-tight">Connectify</h1>
        </div>

        {/* Navbar Links - Desktop */}
        <div className="hidden md:flex space-x-6">
          <Link
            className="text-white hover:text-gray-300 transition duration-300 font-medium"
            to="/create-meeting"
          >
            Schedule Meeting
          </Link>
          <Link
            className="text-white hover:text-gray-300 transition duration-300 font-medium"
            to="/calendar"
          >
            Calendar
          </Link>
          <Link
            className="text-white hover:text-gray-300 transition duration-300 font-medium"
            to="/search"
          >
            Search People
          </Link>
        </div>

        {/* Profile Icon and Mobile Menu Toggle */}
        <div className="flex items-center space-x-4">
          <button onClick={handleProfileClick} className="text-white hover:text-gray-300 transition duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 12c2.28 0 4-1.72 4-4s-1.72-4-4-4-4 1.72-4 4 1.72 4 4 4zm0 2c-3.33 0-10 1.67-10 5v1h20v-1c0-3.33-6.67-5-10-5z"
              />
            </svg>
          </button>
          <button onClick={toggleMenu} className="md:hidden text-white focus:outline-none">
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
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 bg-gray-800 rounded-lg shadow-lg p-4">
          <Link
            className="block text-white hover:text-gray-300 transition duration-300 py-2"
            to="/schedule-meeting"
            onClick={toggleMenu}
          >
            Schedule Meeting
          </Link>
          <Link
            className="block text-white hover:text-gray-300 transition duration-300 py-2"
            to="/calendar"
            onClick={toggleMenu}
          >
            Calendar
          </Link>
          <Link
            className="block text-white hover:text-gray-300 transition duration-300 py-2"
            to="/search"
            onClick={toggleMenu}
          >
            Search People
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
