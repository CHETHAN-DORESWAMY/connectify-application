// Dashboard.js
import React, { useState, useEffect } from "react";
import MeetingList from "./MeetingList";
import Navbar from "./Navbar";

function Dashboard() {
  // Dummy data for today's meetings
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    // Simulating an API call to fetch today's meetings
    const fetchMeetings = async () => {
      const meetingData = [
        {
          time: "10:00 AM",
          title: "Project Sync",
          location: "Room 101",
          participants: ["John Doe", "Jane Smith", "Bob Lee"],
        },
        {
          time: "1:00 PM",
          title: "Team Standup",
          location: "Room 202",
          participants: ["Alice Johnson", "Sarah Lee"],
        },
        {
          time: "3:30 PM",
          title: "Client Presentation",
          location: "Zoom",
          participants: ["Tom Hanks", "Emma Watson", "Robert Downey"],
        },
      ];

      setMeetings(meetingData);
    };

    fetchMeetings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar isLoggedIn={!!sessionStorage.getItem("authToken")} />

      {/* Main Content */}
      <div className="container mx-auto px-4 mt-8">
        <MeetingList meetings={meetings} />
      </div>
    </div>
  );
}

export default Dashboard;
