import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from "./Navbar";

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
    if (email) {
      const token = sessionStorage.getItem("authToken");
      fetch(`${API_END_POINT}/get-by-email/${email}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) return response.json();
          if (response.status === 404) {
            setShowForm(true);
            return null;
          }
          throw new Error("Failed to fetch employee data");
        })
        .then((data) => {
          if (data) setUserData(data.employee);
        })
        .catch((error) => {
          console.error("Error:", error);
          setShowForm(true);
        });
    } else {
      setShowForm(true);
    }
  }, [email]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

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
        setUserData(result.employee);
        setShowForm(false);
        navigate("/dashboard");
      } else {
        console.error("Failed to save profile");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar isLoggedIn={!!sessionStorage.getItem("authToken")} />
      <div className="container mx-auto p-6">
        {showForm ? (
          <div className="bg-white shadow-xl rounded-lg max-w-xl mx-auto p-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Complete Your Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {Object.entries(formData).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {key.replace('emp', '').replace(/([A-Z])/g, ' $1').trim()}:
                  </label>
                  {key === 'empTimezone' ? (
                    <select
                      name={key}
                      value={value}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Timezone</option>
                      <option value="Asia/Kolkata">Mumbai (Asia/Kolkata)</option>
                      <option value="Europe/London">London (Europe/London)</option>
                      <option value="America/New_York">New York (America/New_York)</option>
                      <option value="America/Los_Angeles">Los Angeles (America/Los_Angeles)</option>
                      <option value="Asia/Singapore">Singapore (Asia/Singapore)</option>
                    </select>
                  ) : (
                    <input
                      type={key.includes('Time') ? 'time' : key === 'empEmail' ? 'email' : 'text'}
                      name={key}
                      value={value}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      required={['empId', 'empName', 'empEmail', 'empTimezone', 'empStartTime', 'empEndTime'].includes(key)}
                    />
                  )}
                </div>
              ))}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition duration-300"
              >
                Save Profile
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white shadow-xl rounded-lg max-w-2xl mx-auto p-8">
            <h1 className="text-4xl font-bold mb-6 text-gray-800">Welcome, {userData?.empName || email}!</h1>
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">Employee Information</h2>
              {userData && (
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(userData).map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500">
                        {key.replace('emp', '').replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="text-lg text-gray-800">{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Welcome;