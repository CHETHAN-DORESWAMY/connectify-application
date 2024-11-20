import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { DateTime } from "luxon";

const CreateMeeting = () => {
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
  const [hoveredTime, setHoveredTime] = useState(null);

  const API_END_POINT = "http://localhost:8222/api/employees";
  const MEETING_API_END_POINT = "http://localhost:8222/api/meetings/add";
  const PARTICIPANTS_API_END_POINT =
    "http://localhost:8222/api/participants/add";
  const token = sessionStorage.getItem("authToken");
  const creatorEmail = sessionStorage.getItem("email");
  const creatorTimezone = sessionStorage.getItem("creatorTimezone");

  useEffect(() => {
    const generateMeetingId = () =>
      `MEET-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
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
    const originalTime = DateTime.fromISO(utcTime, { zone: fromTimezone });
    const convertedTime = originalTime.setZone(toTimezone);

    console.log(
      `Original time: ${originalTime.toFormat("HH:mm")} ${fromTimezone}`
    );
    console.log(
      `Converted time: ${convertedTime.toFormat("HH:mm")} ${toTimezone}`
    );

    const formattedTime = convertedTime.toFormat("HH:mm");
    const nextDay = convertedTime.day !== originalTime.day;

    return { time: formattedTime, nextDay };
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
        const localTimeResult = result.map((item) => {
          const startTimeConverted = item.startTime
            ? convertToLocalTime(item.startTime, "utc", creatorTimezone)
            : { time: "No window found", nextDay: false };
          const endTimeConverted = item.endTime
            ? convertToLocalTime(item.endTime, "utc", creatorTimezone)
            : { time: "No window found", nextDay: false };

          return {
            ...item,
            startTime:
              startTimeConverted.time +
              (startTimeConverted.nextDay ? " (next day)" : ""),
            endTime:
              endTimeConverted.time +
              (endTimeConverted.nextDay ? " (next day)" : ""),
          };
        });
        setOverlapResult(localTimeResult);
        setShowTimeFields(true);

        // Fetch working hours for each participant
        const schedules = await Promise.all(
          selectedParticipantsName.map(async (participant) => {
            const workingHoursResponse = await fetch(
              `${API_END_POINT}/get/${participant.empId}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );
            // const workingHours = await workingHoursResponse.json();
            const startTimeConverted = convertToLocalTime(
              participant.empStartTime,
              "utc",
              participant.empTimezone
            );
            console.log(startTimeConverted, "this is thier local time");
            const endTimeConverted = convertToLocalTime(
              participant.empEndTime,
              "utc",
              participant.empTimezone
            );
            return {
              ...participant,
              workingHours: {
                startTime:
                  startTimeConverted.time +
                  (startTimeConverted.nextDay ? " (next day)" : ""),
                endTime:
                  endTimeConverted.time +
                  (endTimeConverted.nextDay ? " (next day)" : ""),
              },
            };
          })
        );
        setParticipantSchedules(schedules);
        console.log(participantSchedules);
        // Print participant working hours to console
        schedules.forEach((participant) => {
          console.log(
            `${participant.empName}'s working hours:`,
            participant.workingHours
          );
        });
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

  function getUTCDifference(timezone) {
    // Get current date and time
    const localDate = new Date();

    // Convert current time to UTC
    const utcDate = new Date(
      localDate.toLocaleString("en-US", { timeZone: "UTC" })
    );

    // Convert current time to the target timezone
    const targetDate = new Date(
      localDate.toLocaleString("en-US", { timeZone: timezone })
    );

    // Calculate the difference in milliseconds
    const differenceInMilliseconds = targetDate - utcDate;

    // Convert to hours and minutes
    const differenceInMinutes = differenceInMilliseconds / 60000; // Convert ms to minutes
    const hours = Math.floor(differenceInMinutes / 60);
    const minutes = Math.abs(differenceInMinutes % 60);

    // Format the output as a string
    return hours;
  }

  // const renderTimeBoxes = (workingHours, participantTimezone) => {
  //   const boxes = [];
  //   // const selectedDate = DateTime.fromISO(meetingDate).setZone(creatorTimezone);
  //   const selectedDate =
  //     DateTime.fromISO(meetingDate).setZone(participantTimezone);
  //   console.log("the selected date is", selectedDate);

  //   const previousDay = selectedDate.minus({ days: 1 });
  //   const nextDay = selectedDate.plus({ days: 1 });
  //   const offset = getUTCDifference(participantTimezone);
  //   // console.log(workingHours, "offest", offset);

  //   let workingHoursFound = false;

  //   for (let day = 0; day < 3; day++) {
  //     const currentDate =
  //       day === 0 ? previousDay : day === 1 ? selectedDate : nextDay;
  //     for (let hour = 0; hour < 24; hour++) {
  //       // const currentTimeUTC = currentTime
  //       //   .toUTC()
  //       //   .toLocaleString(DateTime.TIME_24_SIMPLE);
  //       // console.log(workingHours.startTime);

  //       const startTime = DateTime.fromFormat(
  //         workingHours.startTime.split(" ")[0],
  //         "HH:mm"
  //       ).set({
  //         year: selectedDate.year,
  //         month: selectedDate.month,
  //         day: selectedDate.day,
  //       });
  //       let endTime = DateTime.fromFormat(
  //         workingHours.endTime.split(" ")[0],
  //         "HH:mm"
  //       ).set({
  //         year: selectedDate.year,
  //         month: selectedDate.month,
  //         day: selectedDate.day,
  //       });

  //       if (
  //         endTime < startTime ||
  //         workingHours.endTime.includes("(next day)")
  //       ) {
  //         endTime = endTime.plus({ days: 1 });
  //       }

  //       const calclatedHour = hour + offset;
  //       const currentTime = currentDate.set({ hour: calclatedHour });

  //       console.log(currentTime);
  //       console.log(startTime);
  //       const isWorkingHour =
  //         (currentTime.getHours() >= startTime.getHours() &&
  //           currentTime.getHours() < endTime.getHours()) ||
  //         (currentTime.plus({ days: 1 }) >= startTime &&
  //           currentTime.plus({ days: 1 }) < endTime);

  //       if (isWorkingHour && day === 1) {
  //         workingHoursFound = true;
  //       }

  //       const isHovered =
  //         hoveredTime && hoveredTime.hasSame(currentTime, "hour");
  //       const participantTime = currentTime.setZone(participantTimezone);

  //       boxes.push(
  //         <div
  //           key={`${day}-${hour}`}
  //           className={`w-12 h-12 border border-sky-300 flex items-center justify-center transition-all duration-300 ${
  //             (isWorkingHour && day === 0) ||
  //             (isWorkingHour && day === 1) ||
  //             (isWorkingHour && day === 2)
  //               ? "bg-sky-500 text-white"
  //               : "bg-sky-100 text-sky-800"
  //           } ${isHovered ? "transform scale-110 z-10 shadow-lg" : ""}`}
  //           // title={`${currentTimeUTC} ${creatorTimezone}`}
  //           onMouseEnter={() => setHoveredTime(currentTime)}
  //           onMouseLeave={() => setHoveredTime(null)}
  //         >
  //           <span className="text-[8px]">{currentTime.toFormat("HH:mm")}</span>
  //         </div>
  //       );
  //     }
  //   }
  //   return boxes;
  // };
  const renderTimeBoxes = (workingHours, participantTimezone) => {
    const boxes = [];
    const selectedDate = new Date(meetingDate);

    // Calculate previous and next days
    const previousDay = new Date(selectedDate);
    previousDay.setDate(selectedDate.getDate() - 1);

    const nextDay = new Date(selectedDate);
    nextDay.setDate(selectedDate.getDate() + 1);

    // Parse working hours (assume workingHours.startTime and endTime are strings like "09:00" and "18:00")
    const parseTime = (time, baseDate) => {
      const [hours, minutes] = time.split(":").map(Number);
      const parsedDate = new Date(baseDate);
      parsedDate.setHours(hours, minutes, 0, 0);
      return parsedDate;
    };

    const startTime = parseTime(workingHours.startTime, selectedDate);
    let endTime = parseTime(workingHours.endTime.slice(0, 5), selectedDate);
    console.log(endTime, "end Time before converting");

    if (endTime <= startTime || workingHours.endTime.includes("(next day)")) {
      endTime.setDate(endTime.getDate() + 1); // Handle next day scenarios
    }

    // Get UTC offset in hours for participant time zone
    // const offset = new Date().getTimezoneOffset() / 60;
    const offset = getUTCDifference(participantTimezone);
    // console.log(offset, "offset"); // Offset in hours
    const getAdjustedDate = (date, hourOffset) => {
      const adjustedDate = new Date(date);
      adjustedDate.setHours(adjustedDate.getHours() + hourOffset);
      return adjustedDate;
    };

    let workingHoursFound = false;

    // Iterate over three days
    for (let day = 0; day < 3; day++) {
      const currentDate =
        day === 0 ? previousDay : day === 1 ? selectedDate : nextDay;

      for (let hour = 0; hour < 24; hour++) {
        // Adjust time for the participant's time zone
        const currentTime = getAdjustedDate(currentDate, hour + offset);
        // console.log(currentTime.getHours());
        // console.log("start time", startTime.getHours());

        // console.log(currentTime.getHours());
        // console.log("end time", endTime.getHours());

        const isWorkingHour =
          currentTime.getHours() >= startTime.getHours() &&
          currentTime.getHours() <= endTime.getHours();

        if (isWorkingHour && day === 1) {
          workingHoursFound = true;
        }

        const isHovered =
          hoveredTime &&
          hoveredTime.getHours() === currentTime.getHours() &&
          hoveredTime.getDate() === currentTime.getDate();

        boxes.push(
          <div
            key={`${day}-${hour}`}
            className={`w-12 h-12 border border-indigo-300 flex items-center justify-center transition-all duration-300 ${
              isWorkingHour
                ? "bg-indigo-500 text-white"
                : "bg-indigo-100 text-indigo-800"
            } ${isHovered ? "transform scale-110 z-10 shadow-lg" : ""}`}
            onMouseEnter={() => setHoveredTime(currentTime)}
            onMouseLeave={() => setHoveredTime(null)}
          >
            <span className="text-[8px]">
              {currentTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        );
      }
    }

    return boxes;
  };

  const renderTimeLabels = () => {
    const labels = [];
    const selectedDate = DateTime.fromISO(meetingDate).setZone(creatorTimezone);
    const previousDay = selectedDate.minus({ days: 1 });
    const nextDay = selectedDate.plus({ days: 1 });

    for (let day = 0; day < 3; day++) {
      const currentDate =
        day === 0 ? previousDay : day === 1 ? selectedDate : nextDay;
      for (let hour = 0; hour < 24; hour++) {
        if (hour % 3 === 0) {
          labels.push(
            <div
              key={`label-${day}-${hour}`}
              className="w-12 text-xs text-center text-indigo-600"
            >
              {hour === 0
                ? currentDate.toFormat("MMM dd")
                : `${hour.toString().padStart(2, "0")}:00`}
            </div>
          );
        } else {
          labels.push(
            <div key={`label-${day}-${hour}`} className="w-12"></div>
          );
        }
      }
    }
    return labels;
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 to-purple-200">
      <Navbar isLoggedIn={!!sessionStorage.getItem("authToken")} />
      <div className="container mx-auto p-8">
        <h2 className="text-4xl font-bold mb-12 text-center text-indigo-800 animate-fade-in">
          Create Meeting
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl">
            <h3 className="text-2xl font-semibold mb-6 text-indigo-700">
              Meeting Details
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-indigo-800 mb-2">
                  Meeting Name
                </label>
                <input
                  type="text"
                  value={meetingName}
                  onChange={(e) => setMeetingName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-indigo-800 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-indigo-800 mb-2">
                  Duration (hours)
                </label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-indigo-800 mb-2">
                  Meeting Date
                </label>
                <input
                  type="date"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
              >
                Find Overlapping Interval
              </button>
            </form>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl">
            <h3 className="text-2xl font-semibold mb-6 text-indigo-700">
              Participants
            </h3>
            <div className="relative mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleSearchFocus}
                placeholder="Search participants"
                className="w-full px-4 py-3 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
              />
              {dropdownVisible && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-indigo-300 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                  {filteredParticipants.length === 0 ? (
                    <div className="p-4 text-sm text-indigo-500">
                      No participants found
                    </div>
                  ) : (
                    filteredParticipants.map((participant) => (
                      <div
                        key={participant.empId}
                        onClick={() => handleSelectParticipant(participant)}
                        className="p-3 hover:bg-indigo-50 cursor-pointer text-sm transition duration-200"
                      >
                        {participant.empName} - {participant.empId}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-3 mb-6">
              {selectedParticipantsName.map((participant) => (
                <div
                  key={participant.empId}
                  className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm flex items-center transition-all duration-300 hover:bg-indigo-200"
                >
                  <span className="mr-2">{participant.empName}</span>
                  <button
                    onClick={() => handleRemoveParticipant(participant)}
                    className="text-indigo-500 hover:text-indigo-700 transition duration-200"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            {showTimeFields && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-indigo-800 mb-2">
                    Meeting Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-indigo-800 mb-2">
                    Meeting End Time
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleScheduleMeeting}
                  className="w-full bg-indigo-800 text-white px-6 py-3 rounded-lg hover:bg-indigo-900 transition duration-300 transform hover:scale-105"
                >
                  Schedule Meeting
                </button>
              </div>
            )}
          </div>
        </div>
        {participantSchedules.length > 0 && (
          <div className="mt-12 bg-white p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl">
            <h3 className="text-2xl font-semibold mb-6 text-indigo-700">
              Participant Schedules
            </h3>
            <p className="text-sm text-indigo-600 mb-6">Date: {meetingDate}</p>
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full">
                <div className="grid grid-cols-[auto_1fr] gap-6">
                  <div></div>
                  <div className="flex">{renderTimeLabels()}</div>
                  {participantSchedules.map((participant, index) => (
                    <React.Fragment key={index}>
                      <div className="flex flex-col justify-center">
                        <p className="font-medium text-sm text-indigo-800">
                          {participant.empName}
                        </p>
                        <p className="text-xs text-indigo-600">
                          {participant.empTimezone}
                        </p>
                      </div>
                      <div className="flex">
                        {renderTimeBoxes(
                          participant.workingHours,
                          participant.empTimezone
                        )}
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {console.log(overlapResult)}
        {overlapResult.length > 0 && (
          <div className="mt-12 bg-white p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl">
            <h3 className="text-2xl font-semibold mb-6 text-indigo-700">
              Available Time Slots
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {overlapResult.map((result, index) => (
                <div
                  key={index}
                  className="bg-indigo-50 p-6 rounded-xl transition-all duration-300 hover:shadow-md hover:bg-indigo-100 transform hover:scale-105"
                >
                  <p className="font-semibold text-indigo-800 mb-3">
                    Time Slot {index + 1}
                  </p>
                  <p className="text-sm mb-1">
                    Start:{" "}
                    <span className="font-medium text-indigo-700">
                      {result.startTime}
                    </span>
                  </p>
                  <p className="text-sm mb-3">
                    End:{" "}
                    <span className="font-medium text-indigo-700">
                      {result.endTime}
                    </span>
                  </p>
                  <p className="text-sm font-medium text-indigo-800 mb-2">
                    Available Participants:
                  </p>
                  <ul className="text-sm list-disc list-inside ml-2 text-indigo-600">
                    {result.employeeIds?.map((participant, pIndex) => (
                      <li
                        key={pIndex}
                        className="transition-colors duration-200 hover:text-indigo-800"
                      >
                        {participant.empName} - {participant.empEmail} -{" "}
                        {participant.empPhone}
                      </li>
                    )) ||
                      selectedParticipantsName.map((participant, pIndex) => (
                        <li key={pIndex}>{participant.empName}</li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateMeeting;
