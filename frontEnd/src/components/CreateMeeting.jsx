import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { DateTime } from "luxon";

const CreateMeeting = () => {
  const [meetingName, setMeetingName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [participants, setParticipants] = useState([]); // Store all participants
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [selectedParticipantsName, setSelectedParticipantsName] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // For filtering participants
  const [meetingDate, setMeetingDate] = useState("");
  const [startTime, setStartTime] = useState(""); // Start time field
  const [endTime, setEndTime] = useState(""); // End time field
  const [dropdownVisible, setDropdownVisible] = useState(false); // Toggle dropdown visibility
  const [overlapResult, setOverlapResult] = useState([]); // State for the result of overlapping window
  const [buttonText, setButtonText] = useState("Find Overlapping Interval"); // Dynamic button text
  const API_END_POINT = "http://localhost:8222/api/employees";
  const MEETING_API_ENDPOINT = "http://localhost:8222/api/meetings/add";
  const token = sessionStorage.getItem("authToken");
  const creatorEmail = sessionStorage.getItem("email");
  const meetHostId = sessionStorage.getItem("creatorId");

  // Fetch participants
  useEffect(() => {
    async function fetchParticipants() {
      try {
        const response = await fetch(`${API_END_POINT}/getAll`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setParticipants(data.employees);
          const creator = data.employees.find(
            (participant) => participant.empEmail === creatorEmail
          );
          if (creator) {
            sessionStorage.setItem("creatorId", creator.empId);
            setSelectedParticipants([creator.empId]);
          }
        } else {
          console.error("Failed to fetch participants");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
    fetchParticipants();
  }, [API_END_POINT, token, creatorEmail]);

  const convertToLocalTime = (utcTime) => {
    const creatorTimeZone = participants.find(
      (participant) => participant.empEmail === creatorEmail
    )?.empTimezone;
    console.log(participants);

    console.log(creatorTimeZone);
    console.log(utcTime);
    if (creatorTimeZone) {
      return DateTime.fromISO(utcTime, { zone: "utc" })
        .setZone(creatorTimeZone)
        .toLocaleString(DateTime.DATETIME_MED); // Format to 'MM/DD/YY, hh:mm AM/PM'
    } else {
      console.warn("Creator timezone not found.");
      return utcTime;
    }
  };

  const filteredParticipants = searchQuery
    ? participants.filter(
        (p) =>
          p.empName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.empId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.empEmail?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : participants;

  const handleSelectParticipant = (participant) => {
    if (!selectedParticipants.includes(participant.empId)) {
      setSelectedParticipants([...selectedParticipants, participant.empId]);
      setSelectedParticipantsName([...selectedParticipantsName, participant]);
    }
    setSearchQuery("");
    setDropdownVisible(false);
  };

  const handleRemoveParticipant = (participant) => {
    setSelectedParticipants(
      selectedParticipants.filter((p) => p !== participant.empId)
    );
    setSelectedParticipantsName(
      selectedParticipantsName.filter((p) => p.empId !== participant.empId)
    );
  };

  const handleSearchFocus = () => {
    setDropdownVisible(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (buttonText === "Find Overlapping Interval") {
      try {
        const response = await fetch(API_END_POINT + "/get-window-time", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            meetingDate: meetingDate,
            listOfEmployeeId: selectedParticipants,
          }),
        });
        if (response.ok) {
          const result = await response.json();
          const localTimeResult = result.map((item) => ({
            ...item,
            startTime: item.startTime
              ? convertToLocalTime(item.startTime)
              : "No window found",
            endTime: item.endTime
              ? convertToLocalTime(item.endTime)
              : "No window found",
          }));
          setOverlapResult(localTimeResult);
          setButtonText("Schedule Meeting"); // Update button text
        } else {
          console.error("Failed to find overlap");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      // Schedule Meeting
      try {
        const response = await fetch(MEETING_API_ENDPOINT, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            meetingName:,
            description,
            meetHostId,
            startTime,
            endTime,
            meetingDate,
            duration,
            listOfEmployeeId: selectedParticipants,
          }),
        });
        if (response.ok) {
          console.log("Meeting scheduled successfully");
          // Reset form or navigate to another page
        } else {
          console.error("Failed to schedule meeting");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar isLoggedIn={!!sessionStorage.getItem("authToken")} />
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Create Meeting</h2>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Meeting Name:
            </label>
            <input
              type="text"
              value={meetingName}
              onChange={(e) => setMeetingName(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Description:
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Duration (in hours):
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Meeting Date:
            </label>
            <input
              type="date"
              value={meetingDate}
              onChange={(e) => setMeetingDate(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Start Time:
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              End Time:
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4 relative">
            <label className="block text-gray-700 font-medium mb-2">
              Select Participants:
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={handleSearchFocus}
              placeholder="Search participants"
              className="w-full p-2 border border-gray-300 rounded"
            />
            {dropdownVisible && (
              <div className="absolute w-full bg-white border border-gray-300 rounded shadow-lg mt-2 max-h-40 overflow-y-auto z-10">
                {filteredParticipants.map((participant) => (
                  <div
                    key={participant.empId}
                    onClick={() => handleSelectParticipant(participant)}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                  >
                    {participant.empName}
                  </div>
                ))}
              </div>
            )}
            <div className="mt-2">
              {selectedParticipantsName.map((participant) => (
                <span
                  key={participant.empId}
                  className="inline-block bg-gray-200 text-gray-700 rounded-full px-4 py-1 text-sm font-medium mr-2"
                >
                  {participant.empName}
                  <button
                    onClick={() => handleRemoveParticipant(participant)}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Available Time Windows:
            </label>
            <ul className="list-disc pl-6">
              {overlapResult.map((item, index) => (
                <li key={index}>
                  {item.startTime} - {item.endTime}
                </li>
              ))}
            </ul>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
          >
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateMeeting;
