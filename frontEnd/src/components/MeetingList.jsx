import React, { useState, useEffect } from "react";
import { DateTime } from "luxon";

function MeetingList({ meetings }) {
  const [employeeTimezone, setEmployeeTimezone] = useState("");
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [showParticipants, setShowParticipants] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [viewMode, setViewMode] = useState("scheduled"); // "scheduled" or "toAttend"
  const token = sessionStorage.getItem("authToken");
  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    const fetchEmployeeTimezone = async () => {
      try {
        const email = sessionStorage.getItem("email");
        const response = await fetch(`http://localhost:8222/api/employees/get-by-email/${email}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
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
      console.warn("Employee timezone not found.");
      return utcTime;
    }
  };

  const handleMeetingClick = (meeting) => {
    setSelectedMeeting(meeting);
    setShowParticipants(false);
    setParticipants([]);
  };

  const toggleParticipants = async () => {
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
          setParticipants(data || []);
          setShowParticipants(true);
        } else {
          console.error("Failed to fetch participants");
        }
      } catch (error) {
        console.error("Error fetching participants:", error);
      }
    } else {
      setShowParticipants(false);
    }
  };

  const handleUpdateMeeting = (meetingId) => {
    // Implement update meeting logic
    console.log("Update meeting", meetingId);
  };

  const handleDeleteMeeting = (meetingId) => {
    // Implement delete meeting logic
    console.log("Delete meeting", meetingId);
  };

  const handleConfirmMeeting = async (meetingId) => {
    try {
      const response = await fetch(
        `http://localhost:8222/api/participants/confirm/${meetingId}/${userId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      if (response.ok) {
        // Refresh the meetings list or update the local state
        console.log("Meeting confirmed successfully");
      } else {
        console.error("Failed to confirm meeting");
      }
    } catch (error) {
      console.error("Error confirming meeting:", error);
    }
  };

  const filteredMeetings = meetings.filter(meeting => 
    viewMode === "scheduled" 
      ? meeting.meetHostId === userId
      : meeting.meetHostId !== userId
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold text-gray-800">
          {viewMode === "scheduled" ? "Scheduled Meetings" : "Meetings to Attend"}
        </h3>
        <div className="space-x-2">
          <button
            className={`px-4 py-2 rounded ${viewMode === "scheduled" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => setViewMode("scheduled")}
          >
            Scheduled Meetings
          </button>
          <button
            className={`px-4 py-2 rounded ${viewMode === "toAttend" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => setViewMode("toAttend")}
          >
            Meetings to Attend
          </button>
        </div>
      </div>
      <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <thead className="bg-sky-800 text-white">
          <tr>
            <th className="py-3 px-4 text-left">Meeting Name</th>
            <th className="py-3 px-4 text-left">Description</th>
            <th className="py-3 px-4 text-left">Host ID</th>
            <th className="py-3 px-4 text-left">Start Time</th>
            <th className="py-3 px-4 text-left">End Time</th>
            <th className="py-3 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {filteredMeetings.map((meeting, index) => (
            <tr
              key={index}
              className={`border-t ${
                index % 2 === 0 ? "bg-gray-50" : "bg-white"
              } hover:bg-gray-100`}
            >
              <td className="py-3 px-4">{meeting.meetName}</td>
              <td className="py-3 px-4">{meeting.meetDescription}</td>
              <td className="py-3 px-4">{meeting.meetHostId}</td>
              <td className="py-3 px-4">{convertToLocalTime(meeting.meetStartDateTime)}</td>
              <td className="py-3 px-4">{convertToLocalTime(meeting.meetEndDateTime)}</td>
              <td className="py-3 px-4">
                {viewMode === "scheduled" ? (
                  <>
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                      onClick={() => handleUpdateMeeting(meeting.meetId)}
                    >
                      Update
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => handleDeleteMeeting(meeting.meetId)}
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded"
                    onClick={() => handleConfirmMeeting(meeting.meetId)}
                  >
                    Confirm
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedMeeting && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={() => setSelectedMeeting(null)}>
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" onClick={e => e.stopPropagation()}>
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">{selectedMeeting.meetName}</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Description: {selectedMeeting.meetDescription}
                </p>
                <p className="text-sm text-gray-500">
                  Host ID: {selectedMeeting.meetHostId}
                </p>
                <p className="text-sm text-gray-500">
                  Start Time: {convertToLocalTime(selectedMeeting.meetStartDateTime)}
                </p>
                <p className="text-sm text-gray-500">
                  End Time: {convertToLocalTime(selectedMeeting.meetEndDateTime)}
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  id="ok-btn"
                  className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  onClick={toggleParticipants}
                >
                  {showParticipants ? "Hide Participants" : "Show Participants"}
                </button>
              </div>
              {showParticipants && (
                <div className="mt-4 px-4">
                  <h4 className="text-md font-medium text-gray-900 mb-2">Participants</h4>
                  <table className="min-w-full bg-white">
                    <thead className="bg-gray-200 text-gray-600">
                      <tr>
                        <th className="py-2 px-2 text-left text-xs">Name</th>
                        <th className="py-2 px-2 text-left text-xs">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-700">
                      {participants.map((participant, index) => (
                        <tr key={index} className="border-t">
                          <td className="py-2 px-2 text-xs">{participant.empId}</td>
                          <td className="py-2 px-2 text-xs">{participant.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MeetingList;