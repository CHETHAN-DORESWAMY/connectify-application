import React, { useState, useEffect } from "react";
import { DateTime } from "luxon";

function MeetingList({ meet, selectDate }) {
  const [employeeTimezone, setEmployeeTimezone] = useState("");
  const [selectedDate, setSelectedDate] = useState(selectDate);
  const [viewMode, setViewMode] = useState("allMeetings");
  const token = sessionStorage.getItem("authToken");
  const userId = sessionStorage.getItem("userId");
  const [confirmedMeetings, setConfirmedMeetings] = useState([]);
  const [meetings, setMeetings] = useState(null);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [showParticipants, setShowParticipants] = useState(false);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    if (meet) {
      setMeetings([...meet]);
    }
  }, [meet]);

  useEffect(() => {
    const fetchEmployeeTimezone = async () => {
      try {
        const email = sessionStorage.getItem("email");
        const response = await fetch(
          `http://localhost:8222/api/employees/get-by-email/${email}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setEmployeeTimezone(data.employee.empTimezone);
      } catch (error) {
        console.error("Error fetching employee timezone:", error);
      }
    };
    fetchEmployeeTimezone();
  }, []);

  const convertToLocalTime = (utcTime) => {
    if (employeeTimezone) {
      return DateTime.fromISO(utcTime, { zone: "utc" })
        .setZone(employeeTimezone)
        .toLocaleString(DateTime.DATETIME_MED);
    } else {
      return utcTime;
    }
  };

  const filteredMeetings = meetings
    ? meetings.filter((meeting) => {
        if (selectedDate) {
          return DateTime.fromISO(meeting.meetStartDateTime).hasSame(
            DateTime.fromISO(selectedDate),
            "day"
          );
        } else {
          if (viewMode === "allMeetings") {
            return true;
          } else if (viewMode === "hosted") {
            return meeting.meetHostId === userId;
          } else if (viewMode === "toAttend") {
            return meeting.meetHostId !== userId;
          }
        }
        return false;
      })
    : [];

  const handleClearDate = () => {
    setSelectedDate(null);
  };

  const handleDeleteMeeting = async (meetingId) => {
    try {
      const response = await fetch(
        `http://localhost:8222/api/meetings/delete/${meetingId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const updatedMeetings = meetings.filter(
          (meeting) => meeting.meetId !== meetingId
        );
        setMeetings(updatedMeetings);
        console.log("Meeting deleted successfully");
      } else {
        console.error("Failed to delete meeting");
      }
    } catch (error) {
      console.error("Error deleting meeting:", error);
    }
  };

  const handleConfirmMeeting = async (meetingId) => {
    try {
      const response = await fetch(
        `http://localhost:8222/api/participants/update-status/${userId}/${meetingId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        console.log("Meeting confirmed successfully");
        setConfirmedMeetings([...confirmedMeetings, meetingId]);
      } else {
        console.error("Failed to confirm meeting");
      }
    } catch (error) {
      console.error("Error confirming meeting:", error);
    }
  };

  const handleMeetingClick = (meeting) => {
    setSelectedMeeting(meeting);
    setShowParticipants(false);
    setParticipants([]);
  };

  const handleClosePopup = () => {
    setSelectedMeeting(null);
    setShowParticipants(false);
    setParticipants([]);
  };

  const handleShowParticipants = async () => {
    if (!showParticipants && selectedMeeting) {
      try {
        const response = await fetch(
          `http://localhost:8222/api/participants/meeting-participants-details/${selectedMeeting.meetId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setParticipants(data);
        } else {
          console.error("Failed to fetch participants");
        }
      } catch (error) {
        console.error("Error fetching participants:", error);
      }
    }
    setShowParticipants(!showParticipants);
  };

  if (!meetings) {
    return <p>Loading meetings...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <h3 className="text-2xl font-semibold text-gray-800">
            {selectedDate
              ? `Meetings for ${DateTime.fromISO(selectedDate).toLocaleString(
                  DateTime.DATE_FULL
                )}`
              : viewMode === "allMeetings"
              ? "All Meetings"
              : viewMode === "hosted"
              ? "Hosted Meetings"
              : "Meetings to Attend"}
          </h3>
          {selectedDate && (
            <button
              className="bg-sky-800 text-white px-4 py-2 rounded"
              onClick={handleClearDate}
            >
              Clear Date
            </button>
          )}
        </div>
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded ${
              viewMode === "allMeetings"
                ? "bg-sky-800 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setViewMode("allMeetings")}
          >
            All Meetings
          </button>
          <button
            className={`px-4 py-2 rounded ${
              viewMode === "hosted"
                ? "bg-sky-800 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setViewMode("hosted")}
          >
            Hosted Meetings
          </button>
          <button
            className={`px-4 py-2 rounded ${
              viewMode === "toAttend"
                ? "bg-sky-800 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setViewMode("toAttend")}
          >
            Meetings to Attend
          </button>
        </div>
      </div>
      {filteredMeetings.length > 0 ? (
        <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-sky-800 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Meeting Name</th>
              <th className="py-3 px-4 text-left">Description</th>
              <th className="py-3 px-4 text-left">Host ID</th>
              <th className="py-3 px-4 text-left">Start Time</th>
              <th className="py-3 px-4 text-left">End Time</th>
              <th className="py-3 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {filteredMeetings.map((meeting, index) => (
              <tr
                key={index}
                className={`border-t ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-100 cursor-pointer`}
                onClick={() => handleMeetingClick(meeting)}
              >
                <td className="py-3 px-4">{meeting.meetName}</td>
                <td className="py-3 px-4">{meeting.meetDescription}</td>
                <td className="py-3 px-4">{meeting.meetHostId}</td>
                <td className="py-3 px-4">
                  {convertToLocalTime(meeting.meetStartDateTime)}
                </td>
                <td className="py-3 px-4">
                  {convertToLocalTime(meeting.meetEndDateTime)}
                </td>
                <td className="py-3 px-4">
                  {meeting.meetHostId === userId ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMeeting(meeting.meetId);
                      }}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  ) : meeting.participantStatus === false ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConfirmMeeting(meeting.meetId);
                      }}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Confirm
                    </button>
                  ) : (
                    <span className="text-green-500 font-semibold">
                      Confirmed
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-500 mt-4">
          No meetings found for this selection.
        </p>
      )}

      {selectedMeeting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-4">{selectedMeeting.meetName}</h2>
            <p className="mb-2"><strong>Description:</strong> {selectedMeeting.meetDescription}</p>
            <p className="mb-2"><strong>Host ID:</strong> {selectedMeeting.meetHostId}</p>
            <p className="mb-2"><strong>Start Time:</strong> {convertToLocalTime(selectedMeeting.meetStartDateTime)}</p>
            <p className="mb-2"><strong>End Time:</strong> {convertToLocalTime(selectedMeeting.meetEndDateTime)}</p>
            
            <button
              onClick={handleShowParticipants}
              className="bg-sky-800 text-white px-4 py-2 rounded mt-4"
            >
              {showParticipants ? "Hide Participants" : "Show Participants"}
            </button>

            {showParticipants && (
              <div className="mt-4">
                <h3 className="text-xl font-semibold mb-2">Participants</h3>
                {participants.length > 0 ? (
                  <ul>
                    {participants.map((participant, index) => (
                      <li key={index} className="mb-2">
                        <strong>Name:</strong> {participant.empId}, <strong>Status:</strong> {participant.status}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Loading participants...</p>
                )}
              </div>
            )}

            <button
              onClick={handleClosePopup}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded mt-4 ml-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MeetingList;
