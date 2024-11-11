import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";

const CreateMeeting = () => {
  const [meetingName, setMeetingName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [participants, setParticipants] = useState([]); // Store all participants
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // For filtering participants
  const [meetingDate, setMeetingDate] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false); // Toggle dropdown visibility
  const [overlapResult, setOverlapResult] = useState(""); // State for the result of overlapping window
  const API_END_POINT = "http://localhost:8222/api/employees";
  const token = sessionStorage.getItem("authToken");

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
          setParticipants(data.employees || []); // Ensure employees data is set correctly
        } else {
          console.error("Failed to fetch participants");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
    fetchParticipants();
  }, [API_END_POINT, token]);

  // Filter participants based on search query
  const filteredParticipants = searchQuery
    ? participants.filter((p) =>
        p.empName?.toLowerCase().includes(searchQuery.toLowerCase()) // Ensure name exists
      )
    : participants;

  // Handle participant selection
  const handleSelectParticipant = (participant) => {
    if (!selectedParticipants.some(p => p.empId === participant.empId)) {
      setSelectedParticipants([...selectedParticipants, participant]);
    }
    setSearchQuery(""); // Clear search query after selection
    setDropdownVisible(false); // Hide the dropdown after selection
  };

  // Remove selected participant
  const handleRemoveParticipant = (participant) => {
    setSelectedParticipants(selectedParticipants.filter(p => p.empId !== participant.empId));
  };

  // Handle search box focus
  const handleSearchFocus = () => {
    setDropdownVisible(true); // Show dropdown when the search box is focused
  };

  // Handle form submission (Find Overlapping Interval)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(API_END_POINT + "/get-window-time", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the header
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meetingDate: meetingDate,
          listOfEmployeeId: selectedParticipants.map(p => p.empId), // Only send empId
        }),
      });
      if (response.ok) {
        const result = await response.json();
        setOverlapResult(result.window); // Store the overlap result
      } else {
        console.error("Failed to find overlap");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Create Meeting</h2>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Meeting Name:</label>
            <input
              type="text"
              value={meetingName}
              onChange={(e) => setMeetingName(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Duration (in hours):</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Meeting Date:</label>
            <input
              type="date"
              value={meetingDate}
              onChange={(e) => setMeetingDate(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4 relative">
            <label className="block text-gray-700 font-medium mb-2">Select Participants:</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={handleSearchFocus} // Show dropdown on focus
              placeholder="Search participants"
              className="w-full p-2 border border-gray-300 rounded"
            />
            {dropdownVisible && (
              <div className="absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded shadow-lg max-h-48 overflow-y-auto">
                {filteredParticipants.length === 0 ? (
                  <div className="p-2 text-gray-500">No participants found</div>
                ) : (
                  filteredParticipants.map((participant) => (
                    <div
                      key={participant.empId}
                      onClick={() => handleSelectParticipant(participant)}
                      className="p-2 hover:bg-blue-100 cursor-pointer"
                    >
                      {participant.empName} {/* Display participant name */}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          <div className="flex flex-wrap mt-2">
            {selectedParticipants.map((participant) => (
              <div
                key={participant.empId}
                className="bg-blue-200 text-blue-700 px-3 py-1 m-1 rounded-full flex items-center"
              >
                <span className="mr-2">{participant.empName}</span>
                <button
                  onClick={() => handleRemoveParticipant(participant)}
                  className="text-red-500 hover:text-red-700"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          {/* Display the overlap result */}
          {overlapResult && (
            <div className="mt-4 text-green-500 font-semibold">
              Overlapping Window: {overlapResult}
            </div>
          )}

          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Find Overlapping Interval
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateMeeting;
