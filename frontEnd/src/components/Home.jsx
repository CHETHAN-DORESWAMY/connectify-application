import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function Home() {
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const [showForm, setShowForm] = useState(false);
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
          Authorization: `Bearer ${token}`, // Include the token in the header
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

  return (
    <div>
      {showForm ? (
        <div className="overlay">
          <h2>Complete Your Profile</h2>
          <form>
            <input type="text" placeholder="Name" />
            <input type="email" placeholder="Email" />
            <button type="submit">Save</button>
          </form>
        </div>
      ) : (
        <div>
          <h1>Welcome, {email}!</h1>
          {/* Display other user details as needed */}
        </div>
      )}
    </div>
  );
}

export default Home;
