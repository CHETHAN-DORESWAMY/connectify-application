import React from "react";
import { DateTime } from "luxon";

function MeetingList({ meetings }) {

  const [employeeTimezone, setEmployeeTimezone] = React.useState("");
  const token = sessionStorage.getItem("authToken");

  React.useEffect(() => {
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
        console.log(data.employee.empTimezone);
        setEmployeeTimezone(data.employee.empTimezone);
      } catch (error) {
        console.error("Error fetching employee timezone:", error);
      }
    };
    fetchEmployeeTimezone();
  }, []);

  const convertToLocalTime = (utcTime) => {
    console.log(employeeTimezone);
    console.log(utcTime);
    if (employeeTimezone) {
      return DateTime.fromISO(utcTime, { zone: "utc" })
        .setZone(employeeTimezone)
        .toLocaleString(DateTime.DATETIME_MED);
    } else {
      console.warn("Employee timezone not found.");
      return utcTime;
    }
  };
  // const convertToLocalTime = (utcTime) => {
  //   const employeeTimezone = "Asia/Singapore"; // Set this explicitly if it's constant
  
  //   console.log("Employee Timezone:", employeeTimezone);
  //   console.log("UTC Time:", utcTime);
  //   utcTime = "2024-11-15T05:30:00";
  
  //   if (employeeTimezone) {
  //     return DateTime.fromISO(utcTime, { zone: "utc" })
  //       .setZone(employeeTimezone)
  //       .toFormat("yyyy-MM-dd'T'HH:mm:ss"); // Adjusted to ISO-like format
  //   } else {
  //     console.warn("Employee timezone not found.");
  //     return utcTime;
  //   }
  // };

  return (
    <div className="container mx-auto p-4">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">
        Today's Meetings
      </h3>
      <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <thead className="bg-sky-800 text-white">
          <tr>
            <th className="py-3 px-4 text-left">Meeting Name</th>
            <th className="py-3 px-4 text-left">Description</th>
            <th className="py-3 px-4 text-left">Host ID</th>
            <th className="py-3 px-4 text-left">Start Time</th>
            <th className="py-3 px-4 text-left">End Time</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {meetings.map((meeting, index) => (
            <tr
              key={index}
              className={`border-t ${
                index % 2 === 0 ? "bg-gray-50" : "bg-white"
              }`}
            >
              <td className="py-3 px-4">{meeting.meetName}</td>
              <td className="py-3 px-4">{meeting.meetDescription}</td>
              <td className="py-3 px-4">{meeting.meetHostId}</td>
              <td className="py-3 px-4">{convertToLocalTime(meeting.meetStartDateTime)}</td>
              <td className="py-3 px-4">{convertToLocalTime(meeting.meetEndDateTime)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MeetingList;