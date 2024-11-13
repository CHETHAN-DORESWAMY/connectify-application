import React, { useState, useEffect } from 'react';
import { DateTime } from 'luxon';
import Navbar from './Navbar';

function Calendar() {
  const [currentDate, setCurrentDate] = useState(DateTime.now());
  const [meetings, setMeetings] = useState([]);
  const [employeeTimezone, setEmployeeTimezone] = useState("");
  const token = sessionStorage.getItem("authToken");
  const empId = sessionStorage.getItem("empId");

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

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await fetch(
          `http://localhost:8222/api/participants/${empId}/meetings?date=${currentDate.toISODate()}`,
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
          setMeetings(data.meetings || []);
        }
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    };
    fetchMeetings();
  }, [currentDate, empId]);

  const daysInMonth = () => {
    const firstDay = currentDate.startOf('month');
    const daysArray = [];
    
    for (let i = 0; i < firstDay.weekday % 7; i++) {
      daysArray.push(null);
    }
    
    for (let i = 1; i <= currentDate.daysInMonth; i++) {
      daysArray.push(i);
    }
    
    return daysArray;
  };

  const getMeetingsForDay = (day) => {
    if (!day) return [];
    const dayDate = currentDate.set({ day });
    return meetings.filter(meeting => {
      const meetingDate = DateTime.fromISO(meeting.meetStartDateTime, { zone: 'utc' })
        .setZone(employeeTimezone);
      return meetingDate.hasSame(dayDate, 'day');
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isLoggedIn={!!token} />
      
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-4 max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <button 
              onClick={() => setCurrentDate(currentDate.minus({ months: 1 }))}
              className="p-1 rounded-md hover:bg-gray-100"
            >
              ←
            </button>
            <h2 className="text-xl font-semibold text-gray-800">
              {currentDate.toFormat('MMMM yyyy')}
            </h2>
            <button 
              onClick={() => setCurrentDate(currentDate.plus({ months: 1 }))}
              className="p-1 rounded-md hover:bg-gray-100"
            >
              →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-sm">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-semibold text-gray-600 p-1">
                {day}
              </div>
            ))}
            
            {daysInMonth().map((day, index) => (
              <div 
                key={index}
                className={`min-h-16 p-1 border rounded-md ${
                  day ? 'hover:bg-gray-50' : ''
                } ${
                  day && currentDate.set({ day }).hasSame(DateTime.now(), 'day')
                    ? 'bg-sky-50'
                    : ''
                }`}
              >
                {day && (
                  <>
                    <div className="font-medium text-gray-700 text-xs">{day}</div>
                    <div className="space-y-0.5">
                      {getMeetingsForDay(day).slice(0, 2).map((meeting, idx) => (
                        <div 
                          key={idx}
                          className="text-xs p-0.5 bg-sky-100 rounded truncate"
                          title={meeting.meetName}
                        >
                          {meeting.meetName.substring(0, 10)}...
                        </div>
                      ))}
                      {getMeetingsForDay(day).length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{getMeetingsForDay(day).length - 2} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calendar;
