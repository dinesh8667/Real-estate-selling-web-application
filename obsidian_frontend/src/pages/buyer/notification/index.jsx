import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom'
import axios from 'axios'
import "./style.scss";

function Intex() {
  const token = localStorage.getItem('accessToken')
  const user_id = localStorage.getItem('user_id')
  const [notificationData, setNotificationData] = useState([])

  useEffect(() => {
    async function fetchNotication() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/messages/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const myNotifications = response.data.filter(
          (item) =>
            item.receiver == user_id ||
            item.sender == user_id
        );

        const groupedNotifications = Object.values(
          myNotifications.reduce((acc, message) => {
            const participants = [message.sender, message.receiver]
              .sort((a, b) => a - b);

            const key = `${participants[0]}-${participants[1]}-${message.property}`;

            if (!acc[key]) {
              acc[key] = {
                property: message.property,
                property_title: message.property_title,
                participants,
                messages: [],
              };
            }

            acc[key].messages.push(message);

            return acc;
          }, {})
        ).map((item, index) => ({
          id: index + 1,
          ...item,
        }));

        setNotificationData(groupedNotifications);

      } catch (error) {
        console.log(error);
      }
    }
    fetchNotication()
  }, [])

  useEffect(() => {
    console.log(notificationData);
  }, [notificationData])

  return (
    <div className="inquiries-page">
      <div className="page-header">
        <div>
          <h1>Inquiries</h1>
          <p>
            Manage incoming communications for your premium listings.
          </p>
        </div>

      </div>

      <div className="inquiries-card">
        {notificationData.map((item) => {
          const latestMessage = item.messages[0]
          const propertyId = item.property
          const reciverId = item.participants[0]
          const senderId = item.participants[1]
          console.log(item.participants);
          

          return (
            <Link to={`/chat/${propertyId}/${reciverId}/${senderId}`}>
              <div
                key={item.id}
                className="inquiry-item"
              >
                <div className="avatar">
                  <i class="bi bi-person-check person-icon"></i>
                </div>

                <div className="inquiry-content">
                  <h3>{latestMessage?.receiver_name}</h3>
                  <h5>{item.property_title}</h5>
                  <p>{latestMessage?.content}</p>
                </div>

                <div className="time">
                  {new Date(latestMessage?.timestamp).toLocaleDateString()}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Intex;