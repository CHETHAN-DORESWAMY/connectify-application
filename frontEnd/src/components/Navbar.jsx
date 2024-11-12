import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ isLoggedIn, employeeName }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-black p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src="https://th.bing.com/th?id=OIP.OQPmorjMA98lRVYZXXHJYAHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2"
            alt="App Icon"
            className="h-10 w-10 rounded-full shadow-md"
          />
          <h1 className="text-white text-3xl font-bold tracking-tight">
            Connectify
          </h1>
        </div>

        {/* Navbar Links */}
        {isLoggedIn && (
          <>
            <Link
              to="/dashboard"
              className="text-white hover:text-sky-800 transition-colors duration-200"
            >
              Dashboard
            </Link>
            <Link
              to="/create-meeting"
              className="text-white hover:text-sky-800 transition-colors duration-200"
            >
              Schedule Meeting
            </Link>
            <Link
              to="/create-meeting-1"
              onClick={toggleMenu}
              className="block text-white hover:text-gray-300 py-2"
            >
              Advance Scheduling Meeting
            </Link>
            <Link
              to="/calendar"
              className="text-white hover:text-sky-800 transition-colors duration-200"
            >
              Calendar
            </Link>
            <Link
              to="/search"
              className="text-white hover:text-sky-800 transition-colors duration-200"
            >
              Search People
            </Link>
          </>
        )}

        {/* Profile Button */}
        <div className="flex items-center space-x-4 relative">
          {isLoggedIn && (
            <span className="text-white mr-2">{employeeName}</span>
          )}
          <div className="relative">
            <button
              onClick={handleProfileClick}
              className="text-white hover:text-gray-300 transition duration-300"
            >
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
            {/* Dropdown Menu */}
            {showDropdown && isLoggedIn && (
              <div className="absolute right-0 mt-2 bg-gray-800 rounded-lg shadow-lg p-2 w-40 z-50">
                {/* Display the employee name */}
                <div className="block text-white px-4 py-2 border-b border-gray-600">
                  {employeeName}
                </div>
                <Link
                  to="/welcome"
                  className="block text-white hover:text-gray-300 px-4 py-2"
                >
                  View Profile
                </Link>
                <button
                  onClick={() => {
                    sessionStorage.removeItem("authToken");
                    navigate("/signin");
                  }}
                  className="block text-white hover:text-gray-300 px-4 py-2 w-full text-left"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
          <button
            onClick={toggleMenu}
            className="md:hidden text-white focus:outline-none"
          >
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

      {/* Mobile Dropdown */}
      {isMenuOpen && isLoggedIn && (
        <div className="md:hidden mt-4 bg-gray-800 rounded-lg shadow-lg p-4">
          <Link
            to="/dashboard"
            onClick={toggleMenu}
            className="block text-white hover:text-gray-300 py-2"
          >
            Dashboard
          </Link>
          <Link
            to="/create-meeting"
            onClick={toggleMenu}
            className="block text-white hover:text-gray-300 py-2"
          >
            Schedule Meeting
          </Link>
          <Link
            to="/create-meeting-1"
            onClick={toggleMenu}
            className="block text-white hover:text-gray-300 py-2"
          >
            Advance Scheduling Meeting
          </Link>
          <Link
            to="/calendar"
            onClick={toggleMenu}
            className="block text-white hover:text-gray-300 py-2"
          >
            Calendar
          </Link>
          <Link
            to="/search"
            onClick={toggleMenu}
            className="block text-white hover:text-gray-300 py-2"
          >
            Search People
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
