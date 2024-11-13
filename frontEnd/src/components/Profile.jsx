import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';

const Profile = () => {
  const [employee, setEmployee] = useState(null);
  const { empId } = useParams();
  const endpointUrl = `http://localhost:8222/api/employees/get/${empId}`;
  const token = sessionStorage.getItem("authToken");

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await fetch(endpointUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch employee details");
        }
        const data = await response.json();
        setEmployee(data.employee);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchEmployeeDetails();
  }, [endpointUrl, token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-sky-200">
      <Navbar isLoggedIn={!!sessionStorage.getItem("authToken")} />

      <div className="container mx-auto p-4 mt-6">
        <div className="bg-white shadow-xl rounded-2xl p-6 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-sky-800 mb-4 text-center">Employee Profile</h2>

          {employee ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center mb-4">
                <div className="w-24 h-24 bg-sky-200 rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-sky-800">
                    {employee.empName.charAt(0)}
                  </span>
                </div>
              </div>
              <ProfileItem label="Name" value={employee.empName} />
              <ProfileItem label="Designation" value={employee.empDesignation} />
              <ProfileItem label="Email" value={employee.empEmail} />
              <ProfileItem label="Phone" value={employee.empPhone} />
              <ProfileItem label="City" value={employee.empCity} />
              <ProfileItem label="Timezone" value={employee.empTimezone} />
              <ProfileItem label="Work Hours" value={`${employee.empStartTime} - ${employee.empEndTime}`} />
            </div>
          ) : (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-800"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ProfileItem = ({ label, value }) => (
  <div className="flex items-center border-b border-gray-200 py-2">
    <span className="text-gray-600 font-semibold w-1/3 text-sm">{label}:</span>
    <span className="text-sky-800 font-medium w-2/3 text-sm">{value}</span>
  </div>
);

export default Profile;
