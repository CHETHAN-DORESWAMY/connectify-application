// MeetingList.js
import React from "react";

function MeetingList({ meetings }) {
  return (
    <div className="container mx-auto p-4">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">
        Today's Meetings
      </h3>
      <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <thead className="bg-sky-800 text-white">
          <tr>
            <th className="py-3 px-4 text-left">Time</th>
            <th className="py-3 px-4 text-left">Meeting</th>
            <th className="py-3 px-4 text-left">Location</th>
            <th className="py-3 px-4 text-left">Participants</th>
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
              <td className="py-3 px-4">{meeting.time}</td>
              <td className="py-3 px-4">{meeting.title}</td>
              <td className="py-3 px-4">{meeting.location}</td>
              <td className="py-3 px-4">{meeting.participants.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MeetingList;
