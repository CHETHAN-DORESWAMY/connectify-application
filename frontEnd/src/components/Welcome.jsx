import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar"; // Assuming Navbar is in the same directory

function Welcome() {
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    empId: "",
    empName: "",
    empDesignation: "",
    empEmail: "",
    empPhone: "",
    empCity: "",
    empTimezone: "",
    empStartTime: "",
    empEndTime: "",
  });
  const navigate = useNavigate();

  const API_END_POINT = "http://localhost:8222/api/employees";
  const email = location.state?.userEmail;

  useEffect(() => {
    console.log(email);

    if (email) {
      const token = sessionStorage.getItem("authToken");
      console.log(token); // Assuming the token is stored with this key

      fetch(`${API_END_POINT}/get-by-email/${email}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json(); // Status 200 (employee found)
          } else if (response.status === 404) {
            setShowForm(true); // Status 404 (employee not found)
            return null;
          } else {
            throw new Error("Failed to fetch employee data");
          }
        })
        .then((data) => {
          if (data) {
            setUserData(data.employee);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          setShowForm(true); // Show form in case of any other error
        });
    } else {
      setShowForm(true); // Show form if no empId is provided
    }
  }, [location.state]);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("authToken");

    try {
      const response = await fetch(`${API_END_POINT}/add`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        alert("Profile saved successfully!"); // Show alert on success
        setUserData(result.employee); // Set user data after saving
        setShowForm(false); // Hide the form after successful submission

        // Redirect to the dashboard
        navigate("/dashboard");  // Replace "/dashboard" with your actual route
      } else {
        console.error("Failed to save profile");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-6">
        {showForm ? (
          <div className="overlay p-6 bg-white shadow-lg rounded-lg max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Complete Your Profile</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Employee ID:</label>
                <input
                  type="text"
                  name="empId"
                  value={formData.empId}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Employee Name:</label>
                <input
                  type="text"
                  name="empName"
                  value={formData.empName}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Designation:</label>
                <input
                  type="text"
                  name="empDesignation"
                  value={formData.empDesignation}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email:</label>
                <input
                  type="email"
                  name="empEmail"
                  value={formData.empEmail}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Phone:</label>
                <input
                  type="text"
                  name="empPhone"
                  value={formData.empPhone}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">City:</label>
                <input
                  type="text"
                  name="empCity"
                  value={formData.empCity}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Timezone:</label>
                <select
                  name="empTimezone"
                  value={formData.empTimezone}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                >
                  <option value="">Select Timezone</option>
                  <option value="Asia/Kolkata">Mumbai (Asia/Kolkata)</option>
                  <option value="Europe/London">London (Europe/London)</option>
                  <option value="America/New_York">New York (America/New_York)</option>
                  <option value="America/Los_Angeles">Los Angeles (America/Los_Angeles)</option>
                  <option value="Asia/Singapore">Singapore (Asia/Singapore)</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Start Time:</label>
                <input
                  type="time"
                  name="empStartTime"
                  value={formData.empStartTime}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">End Time:</label>
                <input
                  type="time"
                  name="empEndTime"
                  value={formData.empEndTime}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
              >
                Save
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-3xl font-bold">Welcome, {email}!</h1>
            <div className="mt-4">
              <h2 className="text-xl">Employee Information:</h2>
              {userData && (
                <ul>
                  <li><strong>Name:</strong> {userData.empName}</li>
                  <li><strong>Designation:</strong> {userData.empDesignation}</li>
                  <li><strong>Email:</strong> {userData.empEmail}</li>
                  <li><strong>Phone:</strong> {userData.empPhone}</li>
                  <li><strong>City:</strong> {userData.empCity}</li>
                  <li><strong>Timezone:</strong> {userData.empTimezone}</li>
                  <li><strong>Start Time:</strong> {userData.empStartTime}</li>
                  <li><strong>End Time:</strong> {userData.empEndTime}</li>
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Welcome;