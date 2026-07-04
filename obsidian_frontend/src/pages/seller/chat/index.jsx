import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios, { mergeConfig } from "axios";
import {
  FaArrowLeft,
  FaPaperclip,
  FaPaperPlane,
  FaChevronRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "./chat.scss";

function Index() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [propertyData, setPropertyData] = useState([])
  const token = localStorage.getItem("accessToken");

  const navigate = useNavigate();

  // Assuming you pass these in the URL like: /chat/:propertyId/:receiverId
  const { propertyId, receiverId } = useParams();

  // 1. Fetch existing messages when the page loads
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/messages/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Filter the messages to only show this specific conversation
        const conversation = response.data.filter(
          msg => msg.property.toString() === propertyId &&
            (msg.receiver.toString() === receiverId || msg.sender.toString() === receiverId)
        );

        // Reverse so the newest messages are at the bottom
        setChatHistory(conversation.reverse());
        console.log(response);

      } catch (error) {
        console.error("Failed to load messages", error);
      }
    };

    const fetchClient = async (params) => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/properties/${propertyId}`)
        setPropertyData(response.data);
      } catch (error) {
        console.error("Failed to load messages", error);
      }
    }

    if (propertyId && receiverId) {
      fetchMessages()
      fetchClient()
    }
  }, [propertyId, receiverId])

  // 2. Handle sending the new message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);

    try {
      const token = localStorage.getItem("accessToken");

      const response = await axios.post(
        "http://127.0.0.1:8000/api/messages/",
        {
          content: message,
          // THE FIX: Convert the URL strings into actual database Integers!
          receiver: parseInt(receiverId),
          property: parseInt(propertyId),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Add the new message directly to the UI without reloading the page
      setChatHistory([...chatHistory, response.data]);

      // Clear the input box
      setMessage("");

    } catch (error) {
      // THE DEBUGGING UPGRADE: This tells you EXACTLY what Django didn't like!
      console.error("Django rejected the message because:", error.response?.data || error.message);

      // Optional: Show the user a visual alert so you know what failed
      alert("Failed to send. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  // Determine who the current logged-in user is to align messages left/right
  const currentUserName = localStorage.getItem("userName");

  return (
    <div className="communication-page">
      {/* Header */}
      <div className="chat-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft />
          </button>
          <div className="user-avatar"><i className="bi bi-person-check"></i></div>
          <div className="user-details">
            {/* You can replace this hardcoded name with dynamic data later */}
            <h2>{propertyData.seller_details?.user_name}</h2>
            {
              propertyData.setPropertyData?.is_seller ? <span>{propertyData.seller_details?.agency_name}</span> : <span>Buyer</span>
            }
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="messages-container">
        <Link to={`/property/${propertyId}`}>
          <div className="property-preview">
            <img
              src={propertyData.main_image}
              alt="property"
            />
            <div className="property-info">
              <h3>{propertyData.title}</h3>
              <p>₹ {propertyData.price}</p>
            </div>
            <FaChevronRight className="property-arrow" />
          </div>
        </Link>
        {chatHistory.map((msg) => (
          <div
            key={msg.id}
            className={`message ${msg.sender_name === currentUserName ? "sent" : "received"}`}
          >
            <p>{msg.content}</p>
            <span>
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="chat-input-area">

        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSendMessage(e);
          }}
        />

        <button
          className="send-btn"
          onClick={handleSendMessage}
          disabled={isLoading || !message.trim()}
        >
          {isLoading ? "Sending..." : "Send Reply"} <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}

export default Index;