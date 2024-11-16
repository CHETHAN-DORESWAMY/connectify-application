import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { DateTime } from "luxon";

const UpdatedAlgorithmCreateMeeting = () => {
  const [meetingName, setMeetingName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [participants, setParticipants] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [selectedParticipantsName, setSelectedParticipantsName] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [overlapResult, setOverlapResult] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [showTimeFields, setShowTimeFields] = useState(false);
  const [meetingId, setMeetingId] = useState("");
  const [participantSchedules, setParticipantSchedules] = useState([]);

  const API_END_POINT = "http://localhost:8222/api/employees";
  const MEETING_API_END_POINT = "http://localhost:8222/api/meetings/add";
  const PARTICIPANTS_API_END_POINT = "http://localhost:8222/api/participants/add";
  const token = sessionStorage.getItem("authToken");
  const creatorEmail = sessionStorage.getItem("email");
  const creatorTimezone = sessionStorage.getItem("creatorTimezone");

  useEffect(() => {
    const generateMeetingId = () => `MEET-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    setMeetingId(generateMeetingId());
  }, []);

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
            sessionStorage.setItem("creatorTimezone", creator.empTimezone);
            setSelectedParticipants([creator.empId]);
            setSelectedParticipantsName([creator]);
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

  const convertToLocalTime = (utcTime, fromTimezone, toTimezone) => {
    return DateTime.fromISO(utcTime, { zone: fromTimezone })
      .setZone(toTimezone)
      .toLocaleString(DateTime.TIME_24_SIMPLE);
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
    if (!selectedParticipants.some((p) => p === participant.empId)) {
      setSelectedParticipants([...selectedParticipants, participant.empId]);
      setSelectedParticipantsName([...selectedParticipantsName, participant]);
    }
    setSearchQuery("");
    setDropdownVisible(false);
    setShowTimeFields(false);
    setOverlapResult([]);
  };

  const handleRemoveParticipant = (participant) => {
    setSelectedParticipants(
      selectedParticipants.filter((p) => p !== participant.empId)
    );
    setSelectedParticipantsName(
      selectedParticipantsName.filter((p) => p.empId !== participant.empId)
    );
    setShowTimeFields(false);
    setOverlapResult([]);
  };

  const handleSearchFocus = () => {
    setDropdownVisible(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(API_END_POINT + "/get-red-window", {
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
            ? convertToLocalTime(item.startTime, "utc", creatorTimezone)
            : "No window found",
          endTime: item.endTime
            ? convertToLocalTime(item.endTime, "utc", creatorTimezone)
            : "No window found",
        }));
        setOverlapResult(localTimeResult);
        setShowTimeFields(true);

        // Fetch working hours for each participant
        const schedules = await Promise.all(
          selectedParticipantsName.map(async (participant) => {
            const workingHoursResponse = await fetch(`${API_END_POINT}/get/${participant.empId}`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });
            const workingHours = await workingHoursResponse.json();
            return {
              ...participant,
              workingHours: {
                startTime: convertToLocalTime(participant.empStartTime, "utc", creatorTimezone),
                endTime: convertToLocalTime(participant.empEndTime, "utc", creatorTimezone),
              },
            };
          })
        );
        setParticipantSchedules(schedules);
        console.log(participantSchedules);
      } else {
        console.error("Failed to find overlap");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  

  const handleScheduleMeeting = async () => {
    try {
      const response = await fetch(MEETING_API_END_POINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meetId: meetingId,
          meetName: meetingName,
          meetDescription: description,
          meetDuration: duration,
          meetHostId: sessionStorage.getItem("creatorId"),
          meetDate: meetingDate,
          meetStartTime: startTime,
          meetEndTime: endTime,
          meetParticipants: selectedParticipants,
          noParticipants: selectedParticipants.length,
          meetTimeZone: sessionStorage.getItem("creatorTimezone"),
        }),
      });
      const responseParticipants = await fetch(PARTICIPANTS_API_END_POINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meetingId: meetingId,
          participantsIds: selectedParticipants,
        }),
      });
      if (response.ok && responseParticipants.ok) {
        alert("Meeting successfully scheduled!");
        // Clear the form data
        setMeetingName("");
        setDescription("");
        setDuration("");
        setMeetingDate("");
        setStartTime("");
        setEndTime("");
        setSelectedParticipants([]);
        setSelectedParticipantsName([]);
        setOverlapResult([]);
        setShowTimeFields(false);
        setMeetingId(`MEET-${Date.now()}-${Math.floor(Math.random() * 1000)}`);
      } else {
        console.error("Failed to schedule meeting");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const renderTimeBoxes = (workingHours) => {
    const boxes = [];
    for (let day = 0; day < 2; day++) {
      for (let hour = 0; hour < 24; hour++) {
        const time = `${hour.toString().padStart(2, "0")}:00`;
        const isWorkingHour = time >= workingHours.startTime && time < workingHours.endTime;
        boxes.push(
          <div
            key={`${day}-${hour}`}
            className={`w-6 h-6 border border-gray-300 ${isWorkingHour ? 'bg-green-500' : 'bg-gray-100'}`}
            title={`${time} ${creatorTimezone}`}
          ></div>
        );
      }
    }
    return boxes;
  };

  const renderTimeLabels = () => {
    const labels = [];
    for (let day = 0; day < 2; day++) {
      for (let hour = 0; hour < 24; hour++) {
        if (hour % 3 === 0) {
          labels.push(
            <div key={`label-${day}-${hour}`} className="w-6 text-xs text-center">
              {hour === 0 ? (day === 0 ? 'Day 1' : 'Day 2') : `${hour}`}
            </div>
          );
        } else {
          labels.push(<div key={`label-${day}-${hour}`} className="w-6"></div>);
        }
      }
    }
    return labels;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar isLoggedIn={!!sessionStorage.getItem("authToken")} />
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Create Meeting</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit}>
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
                <div className="absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded shadow-lg max-h-48 overflow-y-auto">
                  {filteredParticipants.length === 0 ? (
                    <div className="p-2 text-gray-500">No participants found</div>
                  ) : (
                    filteredParticipants.map((participant) => (
                      <div
                        key={participant.empId}
                        onClick={() => handleSelectParticipant(participant)}
                        className="p-2 hover:bg-sky-100 cursor-pointer"
                      >
                        {participant.empName} - {participant.empId}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-wrap mt-2">
              {selectedParticipantsName.map((participant) => (
                <div
                  key={participant.empId}
                  className="bg-sky-200 text-sky-800 px-3 py-1 m-1 rounded-full flex items-center"
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
            {participantSchedules.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Participant Schedules</h3>
                <p className="text-sm text-gray-600 mb-2">Date: {meetingDate}</p>
                <div className="overflow-x-auto">
                  <div className="inline-block min-w-full">
                    <div className="grid grid-cols-[auto_1fr] gap-4">
                      <div></div>
                      <div className="flex">{renderTimeLabels()}</div>
                      {participantSchedules.map((participant, index) => (
                        <React.Fragment key={index}>
                          <div className="flex flex-col justify-center">
                            <p className="font-medium">{participant.empName}</p>
                            <p className="text-sm text-gray-600">{participant.empTimezone}</p>
                            {console.log(participant.empStartTime)}
                          </div>
                          <div className="flex">
                            {renderTimeBoxes(participant.workingHours)}
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {overlapResult.length > 0 && (
              <div className="mt-4 text-green-500 font-semibold">
                {overlapResult.map((result, index) => (
                  <div key={index}>
                    <ul>
                      List:{" "}
                      {result.employeeIds.map((ids, index) => (
                        <li key={ids}>{ids}</li>
                      ))}
                    </ul>
                    <p>Meeting Start Time: {result.startTime}</p>
                    <p>Meeting End Time: {result.endTime}</p>
                  </div>
                ))}
              </div>
            )}
            <button
              type="submit"
              className="mt-4 bg-sky-800 text-white px-4 py-2 rounded hover:bg-sky-900 transition duration-200"
            >
              Find Overlapping Interval
            </button>
            {showTimeFields && (
              <>
                <div className="mt-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Meeting Start Time:
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Meeting End Time:
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleScheduleMeeting}
                  className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200"
                >
                  Schedule Meeting
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdatedAlgorithmCreateMeeting;
