import React, { useState, useEffect } from "react";
import ParticipantSearch from "./ParticipantSearch";

const CreateMeeting = () => {
  const [meetingName, setMeetingName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [participants, setParticipants] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [overlapResult, setOverlapResult] = useState(null);
  const [meetingDate, setMeetingDate] = useState("");
  // change the endpoint to gateway after successful integration since token has to add here.
  const API_END_POINT = "http://localhost:8222/api/employees";
  const token = sessionStorage.getItem("authToken");

  // Fetch participants using fetch API
  useEffect(() => {
    async function fetchParticipants() {
      try {
        const response = await fetch(API_END_POINT + "/getAll", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the header
            "Content-Type": "application/json",
          },
        }); // Replace with your actual endpoint
        if (response.ok) {
          const data = await response.json();
          console.log(data.message);
          setParticipants(data.employees);
        } else {
          console.error("Failed to fetch participants");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
    fetchParticipants();
  }, []);

  // Handle participant selection from search results
  const handleSelectParticipant = (empId) => {
    console.log(empId, selectedParticipants.includes(empId));
    if (!selectedParticipants.includes(empId)) {
      setSelectedParticipants([...selectedParticipants, empId]);
    }
    console.log(selectedParticipants);
  };

  // Submit form to find overlapping interval
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
          listOfEmployeeId: selectedParticipants,
        }),
      });
      if (response.ok) {
        const result = await response.json();
        setOverlapResult(result.window);
      } else {
        console.error("Failed to find overlap");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="create-meeting">
      <h2>Create Meeting</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Meeting Name:</label>
          <input
            type="text"
            value={meetingName}
            onChange={(e) => setMeetingName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label>Duration (in hours):</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Meeting Date:</label> {/* New date field */}
          <input
            type="date"
            value={meetingDate}
            onChange={(e) => setMeetingDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Select Participants:</label>
          <ParticipantSearch
            items={participants}
            onSelectEmployee={handleSelectParticipant}
          />
          {/* <div>
            <h4>Selected Participants:</h4>
            <ul>
              {selectedParticipants.map((empId) => (
                <li key={empId}>{empId}</li>
              ))}
            </ul>
          </div> */}
        </div>
        <button type="submit">Find Overlapping Interval</button>
      </form>

      {overlapResult && (
        <div className="overlap-result">
          {/* <h3>Overlap Result</h3>
          <p>
            <strong>Start Time:</strong> {overlapResult.overlapStart}
          </p>
          <p>
            <strong>End Time:</strong> {overlapResult.overlapEnd}
          </p>
          <p>
            <strong>Extends to Next Day:</strong>{" "}
            {overlapResult.extendsToNextDay ? "Yes" : "No"}
          </p> */}
          {/* {overlapResult} */}
          Hiiii {console.log(overlapResult)};
        </div>
      )}
    </div>
  );
};

export default CreateMeeting;
