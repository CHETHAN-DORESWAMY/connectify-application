import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid"; // Generates unique IDs
import Navbar from "./Navbar";

function ScheduleMeeting() {
  const [meetingData, setMeetingData] = useState({
    id: uuidv4(),
    description: "",
    participants: [],
    date: "",
  });

  const [notificationStatus, setNotificationStatus] = useState("");

  // List of participants for selection (can be fetched from an API)
  const participantsList = ["Alice", "Bob", "Charlie", "David"];

  const handleChange = (e) => {
    setMeetingData({
      ...meetingData,
      [e.target.name]: e.target.value,
    });
  };

  const handleParticipantsChange = (e) => {
    const { value, checked } = e.target;
    setMeetingData((prevState) => ({
      ...prevState,
      participants: checked
        ? [...prevState.participants, value]
        : prevState.participants.filter((participant) => participant !== value),
    }));
  };

  const handleSendNotification = () => {
    setNotificationStatus("Sending notifications... Waiting for approval.");

    setTimeout(() => {
      const allApproved = Math.random() > 0.5; // Random approval simulation
      setNotificationStatus(
        allApproved
          ? "All participants approved! Meeting scheduled."
          : "Approval pending from some participants."
      );
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar /> {/* Navbar positioned at the top */}
      <div className="flex items-center justify-center pt-8">
        <form className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center mb-6">Schedule a Meeting</h2>

          {/* Meeting ID */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Meeting ID</label>
            <input
              type="text"
              name="id"
              value={meetingData.id}
              disabled
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-200 cursor-not-allowed"
            />
          </div>

          {/* Meeting Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Description</label>
            <textarea
              name="description"
              value={meetingData.description}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter meeting description"
            ></textarea>
          </div>

          {/* Participants Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Participants</label>
            <div className="flex flex-wrap">
              {participantsList.map((participant) => (
                <label key={participant} className="mr-4 mb-2 flex items-center">
                  <input
                    type="checkbox"
                    value={participant}
                    checked={meetingData.participants.includes(participant)}
                    onChange={handleParticipantsChange}
                    className="mr-2"
                  />
                  {participant}
                </label>
              ))}
            </div>
          </div>

          {/* Meeting Date */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Date</label>
            <input
              type="date"
              name="date"
              value={meetingData.date}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Notification Status */}
          {notificationStatus && (
            <p
              className={`text-center p-2 mb-4 rounded-md ${
                notificationStatus.includes("scheduled")
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {notificationStatus}
            </p>
          )}

          {/* Send Notification Button */}
          <button
            type="button"
            onClick={handleSendNotification}
            className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Send Notification
          </button>
        </form>
      </div>
    </div>
  );
}

export default ScheduleMeeting;
