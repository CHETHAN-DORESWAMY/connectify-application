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
    <nav className="bg-gradient-to-r from-black via-sky-800 to-sky-600 p-4 shadow-lg">
      <div className="container mx-auto max-w-6xl flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src="https://th.bing.com/th?id=OIP.OQPmorjMA98lRVYZXXHJYAHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2"
            alt="App Icon"
            className="h-10 w-10 rounded-full shadow-md border-2 border-white"
          />
          <h1 
            onClick={() => navigate('/')} 
            className="text-white text-3xl font-extrabold tracking-wider cursor-pointer hover:text-yellow-300 transition-colors duration-300"
          >
            Connectify
          </h1>
        </div>

        {isLoggedIn && (
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/dashboard" className="text-white font-semibold hover:text-yellow-300 transition-colors duration-200 text-lg transform hover:scale-110">Dashboard</Link>
            <Link to="/create-meeting" className="text-white font-semibold hover:text-yellow-300 transition-colors duration-200 text-lg transform hover:scale-110">Schedule Meeting</Link>
            <Link to="/calendar" className="text-white font-semibold hover:text-yellow-300 transition-colors duration-200 text-lg transform hover:scale-110">Calendar</Link>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search People"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white bg-opacity-20 text-black placeholder-gray-600 pl-4 pr-10 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all duration-300"
              />
              <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              {filteredEmployees.length > 0 && (
                <ul className="absolute top-full left-0 mt-2 bg-white text-gray-800 w-full rounded-lg shadow-lg overflow-hidden max-h-48 overflow-y-auto">
                  {filteredEmployees.map((emp) => (
                    <li
                      key={emp.empId}
                      onClick={() => navigate(`/profile/${emp.empId}`)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                    >
                      {emp.empId} - {emp.empName} ({emp.empEmail})
                    </li>
                  ))}
                </ul>
              )}
            </form>
          </div>
        )}

        <div className="flex items-center space-x-4 relative">
          {isLoggedIn && <span className="text-white mr-2 hidden md:inline font-semibold">{employeeName}</span>}
          <div className="relative">
            <button onClick={handleProfileClick} className="text-white hover:text-yellow-300 transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 12c2.28 0 4-1.72 4-4s-1.72-4-4-4-4 1.72-4 4 1.72 4 4 4zm0 2c-3.33 0-10 1.67-10 5v1h20v-1c0-3.33-6.67-5-10-5z" />
              </svg>
            </button>
            {showDropdown && isLoggedIn && (
              <div className="absolute right-0 mt-3 bg-white rounded-lg shadow-xl p-2 w-48 z-50">
                <div className="block text-gray-800 font-semibold px-4 py-2 border-b border-gray-200">{employeeName}</div>
                <Link to={`/profile/${sessionStorage.getItem("creatorId")}`} className="block text-gray-700 hover:bg-blue-100 px-4 py-2 rounded transition-colors duration-200">View Profile</Link>
                <button
                  onClick={() => {
                    sessionStorage.removeItem("authToken");
                    navigate("/signin");
                  }}
                  className="block text-gray-700 hover:bg-blue-100 px-4 py-2 w-full text-left rounded transition-colors duration-200"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
          <button onClick={toggleMenu} className="md:hidden text-white focus:outline-none hover:text-yellow-300 transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {isMenuOpen && isLoggedIn && (
        <div className="md:hidden mt-4 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-4">
          <Link to="/dashboard" onClick={toggleMenu} className="block text-white font-semibold hover:text-yellow-300 py-2 transform hover:translate-x-2 transition-all duration-200">Dashboard</Link>
          <Link to="/create-meeting" onClick={toggleMenu} className="block text-white font-semibold hover:text-yellow-300 py-2 transform hover:translate-x-2 transition-all duration-200">Schedule Meeting</Link>
          <Link to="/calendar" onClick={toggleMenu} className="block text-white font-semibold hover:text-yellow-300 py-2 transform hover:translate-x-2 transition-all duration-200">Calendar</Link>
          <Link to="/search" onClick={toggleMenu} className="block text-white font-semibold hover:text-yellow-300 py-2 transform hover:translate-x-2 transition-all duration-200">Search People</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
