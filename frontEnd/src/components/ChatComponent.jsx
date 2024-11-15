import React, { useEffect, useState } from "react";
import ChatComponent from "./ChatComponent";

const ChatApp = () => {
  const [currentChatUser, setCurrentChatUser] = useState(null); // Track the currently selected chat user
  const senderId = sessionStorage.getItem("userId"); // Replace with actual logged-in user's ID

  // Dummy list of users
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(`${API_END_POINT}/getAll`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setEmployees(data.employees || []);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  // Function to select a user to chat with
  const handleUserSelection = (userId) => {
    setCurrentChatUser(userId);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar for User List */}
      <div
        style={{
          width: "25%",
          borderRight: "1px solid #ccc",
          padding: "16px",
        }}
      >
        <h3>Available Users</h3>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {employees.map((user) => (
            <li
              key={user.id}
              style={{
                margin: "8px 0",
                cursor: "pointer",
                color: currentChatUser === user.id ? "blue" : "black",
              }}
              onClick={() => handleUserSelection(user.id)}
            >
              {user.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, padding: "16px" }}>
        {currentChatUser ? (
          <ChatComponent senderId={senderId} receiverId={currentChatUser} />
        ) : (
          <p>Select a user to start chatting</p>
        )}
      </div>
    </div>
  );
};

export default ChatApp;
