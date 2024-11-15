import React, { useState, useEffect } from "react";
import { DateTime } from "luxon";

function MeetingList({ meet, selectDate }) {
  const [employeeTimezone, setEmployeeTimezone] = useState("");
  const [selectedDate, setSelectedDate] = useState(selectDate);
  const [viewMode, setViewMode] = useState("scheduled"); // "scheduled" or "toAttend"
  const token = sessionStorage.getItem("authToken");
  const userId = sessionStorage.getItem("userId");
  const [confirmedMeetings, setConfirmedMeetings] = useState([]);
  const [meetings, setMeetings] = useState(null); // Initialize as null

  useEffect(() => {
    // Wait for `meet` to be defined and then set it to `meetings`
    if (meet) {
      setMeetings([...meet]);
    }
  }, [meet]);

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
      return utcTime;
    }
  };

  // Filter the meetings only if `meetings` is defined
  const filteredMeetings = meetings
    ? meetings.filter((meeting) => {
        if (selectedDate) {
          // Filter by selected date
          return DateTime.fromISO(meeting.meetStartDateTime).hasSame(
            DateTime.fromISO(selectedDate),
            "day"
          );
        } else {
          // Show all meetings based on viewMode
          if (viewMode === "scheduled") {
            return meeting.meetHostId === userId; // Hosted by user
          } else if (viewMode === "toAttend") {
            return meeting.meetHostId !== userId; // User is a participant
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
      const response = await fetch(`http://localhost:8222/api/meetings/delete/${meetingId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        // Remove the deleted meeting from the list
        const updatedMeetings = meetings.filter((meeting) => meeting.meetId !== meetingId);
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
      const status = "confirmed";
      const response = await fetch(
        `http://localhost:8222/api/participants/update-status/${userId}/${meetingId}/${status}`,
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

  if (!meetings) {
    // Render a loading message while `meetings` is not set
    return <p>Loading meetings...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          {selectedDate ? (
            <h3 className="text-2xl font-semibold text-gray-800">
              Meetings for {DateTime.fromISO(selectedDate).toLocaleString(DateTime.DATE_FULL)}
            </h3>
          ) : (
            <h3 className="text-2xl font-semibold text-gray-800">
              {viewMode === "scheduled" ? "Scheduled Meetings" : "Meetings to Attend"}
            </h3>
          )}
        </div>
        <div className="flex space-x-4">
          {selectedDate && (
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={handleClearDate}
            >
              Clear Date
            </button>
          )}
          <button
            className={`px-4 py-2 rounded ${
              viewMode === "scheduled" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setViewMode("scheduled")}
          >
            Scheduled Meetings
          </button>
          <button
            className={`px-4 py-2 rounded ${
              viewMode === "toAttend" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
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
                } hover:bg-gray-100`}
              >
                <td className="py-3 px-4">{meeting.meetName}</td>
                <td className="py-3 px-4">{meeting.meetDescription}</td>
                <td className="py-3 px-4">{meeting.meetHostId}</td>
                <td className="py-3 px-4">{convertToLocalTime(meeting.meetStartDateTime)}</td>
                <td className="py-3 px-4">{convertToLocalTime(meeting.meetEndDateTime)}</td>
                <td className="py-3 px-4">
                  {viewMode === "scheduled" ? (
                    <button
                      onClick={() => handleDeleteMeeting(meeting.meetId)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  ) : confirmedMeetings.includes(meeting.meetId) ? (
                    <span className="text-green-500 font-semibold">Confirmed</span>
                  ) : (
                    <button
                      onClick={() => handleConfirmMeeting(meeting.meetId)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Confirm
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-500 mt-4">No meetings found for this selection.</p>
      )}
    </div>
  );
}

export default MeetingList;
