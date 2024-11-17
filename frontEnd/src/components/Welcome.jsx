import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
          if (data) {
            setUserData(data.employee);
            if (!data.employee.profileStatus) {
              setFormData({
                empId: data.employee.empId || "",
                empName: data.employee.empName || "",
                empDesignation: data.employee.empDesignation || "",
                empEmail: data.employee.empEmail || "",
                empPhone: data.employee.empPhone || "",
                empCity: data.employee.empCity || "",
                empTimezone: "",
                empStartTime: "",
                empEndTime: "",
              });
              setShowForm(true);

              sessionStorage.setItem("userId", data.employee.empId);
            } else {
              sessionStorage.setItem(
                "creatorTimezone",
                data.employee.empTimezone
              );
            }
          }
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
      console.log(sessionStorage.getItem("userId"));
      const response = await fetch(
        `http://localhost:8222/api/employees/update-status/${sessionStorage.getItem(
          "userId"
        )}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // const result = await response.json();
        // setUserData(result.employee);
        sessionStorage.setItem("creatorTimezone", empTimezone);
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
    <div className="min-h-screen bg-gray-50">
      <Navbar isLoggedIn={!!sessionStorage.getItem("authToken")} />
      <div className="container mx-auto p-6">
        {showForm ? (
          <div className="bg-white shadow-md rounded-lg max-w-xl mx-auto p-8">
            <h2 className="text-2xl font-semibold mb-6 text-sky-800">
              Complete Your Profile
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {Object.entries(formData).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {key
                      .replace("emp", "")
                      .replace(/([A-Z])/g, " $1")
                      .trim()}
                    :
                  </label>
                  {key === "empTimezone" ? (
                    <select
                      name={key}
                      value={value}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-sky-800 transition-all duration-300"
                      required
                    >
                      <option value="">Select Timezone</option>
                      <option value="Asia/Kolkata">
                        Mumbai (Asia/Kolkata)
                      </option>
                      <option value="Europe/London">
                        London (Europe/London)
                      </option>
                      <option value="America/New_York">
                        New York (America/New_York)
                      </option>
                      <option value="America/Los_Angeles">
                        Los Angeles (America/Los_Angeles)
                      </option>
                      <option value="Asia/Singapore">
                        Singapore (Asia/Singapore)
                      </option>
                    </select>
                  ) : key === "empStartTime" || key === "empEndTime" ? (
                    <input
                      type="time"
                      name={key}
                      value={value}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-sky-800 transition-all duration-300"
                      required
                    />
                  ) : (
                    <input
                      type={key === "empEmail" ? "email" : "text"}
                      name={key}
                      value={value}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-sky-800 transition-all duration-300"
                      required={["empId", "empName", "empEmail"].includes(key)}
                      readOnly={[
                        "empId",
                        "empName",
                        "empDesignation",
                        "empEmail",
                        "empPhone",
                        "empCity",
                      ].includes(key)}
                    />
                  )}
                </div>
              ))}
              <button
                type="submit"
                className="w-full bg-sky-800 text-white py-2 px-4 rounded-md hover:bg-sky-900 transition-all duration-300"
              >
                Save Profile
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg max-w-2xl mx-auto p-8">
            <h1 className="text-3xl font-semibold mb-6 text-sky-800">
              Welcome, {userData?.empName || email}
            </h1>
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-sky-800">
                Your Profile
              </h2>
              {userData && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-600">
                      Name
                    </span>
                    <span className="text-lg text-gray-800">
                      {userData.empName}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-600">
                      Designation
                    </span>
                    <span className="text-lg text-gray-800">
                      {userData.empDesignation}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-600">
                      Email
                    </span>
                    <span className="text-lg text-gray-800">
                      {userData.empEmail}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-600">
                      City
                    </span>
                    <span className="text-lg text-gray-800">
                      {userData.empCity}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="mt-6 w-full bg-sky-800 text-white py-2 px-4 rounded-md hover:bg-sky-900 transition-all duration-300"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Welcome;
