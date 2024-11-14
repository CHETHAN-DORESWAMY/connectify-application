import React, { useState, useEffect } from "react";
import MeetingList from "./MeetingList";
import Navbar from "./Navbar";

function Dashboard() {
  const [meetings, setMeetings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const token = sessionStorage.getItem("authToken");
  const empId = sessionStorage.getItem("empId");
  const API_END_POINT = `http://localhost:8222/api/participants`;

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await fetch(`${API_END_POINT}/${empId}/meetings?date=${selectedDate}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch meetings");
        }

        if (response.status === 200) {
          const data = await response.json();
          console.log(data);
          setMeetings(data.meetings || []); // Ensure meetings is always an array
        }
      } catch (error) {
        console.error("Error fetching meetings:", error);
        setMeetings([]); // Set meetings to an empty array in case of error
      }
    };

    fetchMeetings();
  }, [API_END_POINT, empId, selectedDate, token]);

  const filteredMeetings = meetings?.filter(meeting => {
    const meetingDate = new Date(meeting.meetStartDateTime).toISOString().split('T')[0];
    return meetingDate === selectedDate;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar isLoggedIn={!!token} />

      {/* Main Content */}
      <div className="container mx-auto px-4 mt-8">
        <div className="mb-4">
          <label htmlFor="date-select" className="block text-sm font-medium text-gray-700">Select Date:</label>
          <input
            type="date"
            id="date-select"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <MeetingList meetings={filteredMeetings} />
      </div>
    </div>
  );
}

export default Dashboard;
