import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ isLoggedIn, employeeName }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const API_END_POINT = "http://localhost:8222/api/employees";
  const token = sessionStorage.getItem("authToken");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  // Fetch employees when component mounts
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(`${API_END_POINT}/getAll`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setEmployees(data.employees || []);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  // Filter employees based on search query while typing
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredEmployees([]);
    } else {
      const lowercasedTerm = searchQuery.toLowerCase();
      setFilteredEmployees(
        employees.filter(
          (emp) =>
            emp.empId.toLowerCase().includes(lowercasedTerm) ||
            emp.empName.toLowerCase().includes(lowercasedTerm) ||
            emp.empEmail.toLowerCase().includes(lowercasedTerm)
        )
      );
    }
  }, [searchQuery, employees]);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-black p-4 shadow-lg">
      <div className="container mx-auto max-w-5xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src="https://th.bing.com/th?id=OIP.OQPmorjMA98lRVYZXXHJYAHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2"
            alt="App Icon"
            className="h-9 w-9 rounded-full shadow-md"
          />
          <h1 className="text-white text-3xl font-bold tracking-tight">Connectify</h1>
        </div>

        {/* Navbar Links */}
        {isLoggedIn && (
          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/dashboard" className="text-white hover:text-sky-800 transition-colors duration-200 text-lg">Dashboard</Link>
            <Link to="/create-meeting" className="text-white hover:text-sky-800 transition-colors duration-200 text-lg">Schedule Meeting</Link>
            <Link to="/calendar" className="text-white hover:text-sky-800 transition-colors duration-200 text-lg">Calendar</Link>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search People"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-700 text-white pl-3 pr-10 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-800"
              />
              <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              {/* Display filtered employees */}
              {filteredEmployees.length > 0 && (
                <ul className="absolute top-full left-0 mt-1 bg-white text-black w-full rounded-lg shadow-lg overflow-hidden max-h-48 overflow-y-auto">
                  {filteredEmployees.map((emp) => (
                    <li
                      key={emp.empId}
                      onClick={() => navigate(`/profile/${emp.empId}`)}
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                    >
                      {emp.empId} - {emp.empName} ({emp.empEmail})
                    </li>
                  ))}
                </ul>
              )}
            </form>
          </div>
        )}

        {/* Profile Button */}
        <div className="flex items-center space-x-4 relative">
          {isLoggedIn && <span className="text-white mr-2 hidden md:inline">{employeeName}</span>}
          <div className="relative">
            <button onClick={handleProfileClick} className="text-white hover:text-gray-300 transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 12c2.28 0 4-1.72 4-4s-1.72-4-4-4-4 1.72-4 4 1.72 4 4 4zm0 2c-3.33 0-10 1.67-10 5v1h20v-1c0-3.33-6.67-5-10-5z" />
              </svg>
            </button>
            {showDropdown && isLoggedIn && (
              <div className="absolute right-0 mt-2 bg-gray-800 rounded-lg shadow-lg p-2 w-40 z-50">
                <div className="block text-white px-4 py-2 border-b border-gray-600">{employeeName}</div>
                <Link to="/welcome" className="block text-white hover:text-gray-300 px-4 py-2">View Profile</Link>
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
          <button onClick={toggleMenu} className="md:hidden text-white focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
