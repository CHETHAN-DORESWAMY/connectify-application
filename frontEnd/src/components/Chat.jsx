import React, { useState, useEffect } from "react";

const ChatComponent = ({ senderId, receiverId }) => {
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState("");

  // Fetch unread messages
  const getUnreadMessages = async () => {
    try {
      const response = await fetch(`http://localhost:8096/api/messages/unread/${receiverId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        console.error("Error fetching unread messages:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching unread messages:", error);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (messageContent.trim()) {
      const senderZoneId = "UTC"; // Assuming UTC, replace with actual timezone logic

      const requestBody = {
        senderId,
        senderZoneId,
        receiverId,
        content: messageContent,
      };

      try {
        const response = await fetch("http://localhost:8096/api/messages/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {
          const message = await response.json();
          // Append sent message to chat
          setMessages([...messages, message]);
          setMessageContent(""); // Clear input
        } else {
          console.error("Error sending message:", response.statusText);
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  // Mark messages as read
  const markMessagesAsRead = async () => {
    try {
      const messageIds = messages
        .filter((msg) => !msg.read)
        .map((msg) => msg.id);
      if (messageIds.length > 0) {
        const response = await fetch("http://localhost:8096/api/messages/mark-as-read", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(messageIds),
        });

        if (response.ok) {
          // Update message state (mark them as read locally)
          setMessages((prevMessages) =>
            prevMessages.map((msg) => ({ ...msg, read: true }))
          );
        } else {
          console.error("Error marking messages as read:", response.statusText);
        }
      }
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  // Fetch unread messages when component mounts
  useEffect(() => {
    getUnreadMessages();
  }, [receiverId]);

  return (
    <div style={{ border: "1px solid #ccc", padding: "16px", width: "400px" }}>
      <h3>Chat with {receiverId}</h3>
      <div
        style={{
          height: "300px",
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: "8px",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              margin: "8px 0",
              backgroundColor: msg.read ? "#e0e0e0" : "#f7f7f7",
              padding: "8px",
              borderRadius: "4px",
            }}
          >
            <strong>{msg.senderId === senderId ? "You" : "Them"}:</strong>{" "}
            {msg.content}
          </div>
        ))}
      </div>
      <div style={{ marginTop: "16px" }}>
        <input
          type="text"
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          style={{ width: "300px", marginRight: "8px" }}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      <div style={{ marginTop: "16px" }}>
        <button onClick={markMessagesAsRead}>Mark all as read</button>
      </div>
    </div>
  );
};

export default ChatComponent;
