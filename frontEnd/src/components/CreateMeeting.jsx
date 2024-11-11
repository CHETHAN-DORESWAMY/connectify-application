import React, { useState, useEffect } from "react";
import ParticipantSearch from "./ParticipantSearch";

const CreateMeeting = () => {
  const [meetingName, setMeetingName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [participants, setParticipants] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  let [overlapResult, setOverlapResult] = useState([]);

  const [meetingDate, setMeetingDate] = useState("");
  const API_END_POINT = "http://localhost:8222/api/employees";
  const token = sessionStorage.getItem("authToken");
  const creatorEmail = sessionStorage.getItem("email");

  // Fetch participants
  useEffect(() => {
    async function fetchParticipants() {
      try {
        const response = await fetch(API_END_POINT + "/getAll", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setParticipants(data.employees);

          // Find creator after fetching participants and set selectedParticipants
          const creator = data.employees.find(
            (participant) => participant.empEmail === creatorEmail
          );
          if (creator) {
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

  function showWindow() {
    console.log(overlapResult);
    if (overlapResult && overlapResult.Green) {
      const overlapDatagreen = overlapResult.Green;
      convertToLocalTime(overlapDatagreen);
      const overlapDataamber = overlapResult.amber;
      convertToLocalTime(overlapDataamber);
    } else {
      console.warn("No Green overlap result found.");
    }
  }
  function convertToLocalTime(overlapData) {
    const startTimeUtc = overlapData.overlapStart; // Adjusted key name to match your response structure
    const endTimeUtc = overlapData.overlapEnd;

    // Meeting creator's timezone
    const creatorTimeZone = participants.find(
      (participant) => participant.empEmail === creatorEmail
    )?.empTimezone;

    if (creatorTimeZone) {
      // Convert to creator's local time
      const startTimeLocal = new Intl.DateTimeFormat("en-US", {
        timeZone: creatorTimeZone,
        dateStyle: "short",
        timeStyle: "short",
      }).format(new Date(startTimeUtc));

      const endTimeLocal = new Intl.DateTimeFormat("en-US", {
        timeZone: creatorTimeZone,
        dateStyle: "short",
        timeStyle: "short",
      }).format(new Date(endTimeUtc));

      console.log("Meeting Start Time:", startTimeLocal);
      console.log("Meeting End Time:", endTimeLocal);
    } else {
      console.warn("Creator timezone not found.");
    }
  }

  // Handle participant selection from search results
  const handleSelectParticipant = (empId) => {
    if (!selectedParticipants.includes(empId)) {
      setSelectedParticipants([...selectedParticipants, empId]);
    }
  };

  function handleSubmit(event) {
    event.preventDefault();
    console.log("in handleSubmit");
    fetch(API_END_POINT + "/get-window-time", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        meetingDate: meetingDate,
        listOfEmployeeId: selectedParticipants,
      }),
    })
      .then((res) => res.json())
      .then((data1) => {
        console.log(data1[0].type);
        console.log(overlapResult);
        setTestResult(data1[0].type);
        setOverlapResult(data1);
        console.log(overlapResult);
        console.log(testResult);

        //showWindow();
      });
  }
  // Submit form to find overlapping interval

  // useEffect(() => {
  //   async function handleSubmit(e) {
  //     e.preventDefault();
  //     try {
  //       const response = await fetch(API_END_POINT + "/get-window-time", {
  //         method: "POST",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           meetingDate: meetingDate,
  //           listOfEmployeeId: selectedParticipants,
  //         }),
  //       });
  //       if (response.ok) {
  //         const result = await response.json();
  //         console.log("data");
  //         let copyData = [...result];
  //         console.log(copyData);

  //         setOverlapResult(copyData);
  //         console.log(overlapResult);

  //         showWindow();
  //       } else {
  //         console.error("Failed to find overlap");
  //       }
  //     } catch (error) {
  //       console.error("Error:", error);
  //     }
  //   }
  // }, [API_END_POINT, token, creatorEmail]);

  return (
    <div className="create-meeting">
      <h2>Create Meeting</h2>
      <form onSubmit={(e) => handleSubmit(e)}>
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
          <label>Meeting Date:</label>
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
        </div>
        <button type="submit">Find Overlapping Interval</button>
      </form>

      {overlapResult && (
        <div>
          <h3>The window</h3>
          <div className="overlap-result">
            <h3>Overlap Result</h3>
            <p>
              <strong> Green Start Time:</strong>{" "}
              {overlapResult.Green?.overlapStart || "No window !!"}
            </p>
            <p>
              <strong>Green End Time:</strong>{" "}
              {overlapResult.Green?.overlapEnd || "No window !!"}
            </p>
            <p>
              <strong> Amber Start Time:</strong>{" "}
              {overlapResult.amber?.overlapStart || "No window !!"}
            </p>
            <p>
              <strong>Amber End Time:</strong>
              {overlapResult.amber}
              {overlapResult.amber?.overlapEnd || "No window !!"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateMeeting;
