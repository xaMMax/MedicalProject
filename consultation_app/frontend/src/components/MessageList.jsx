import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import 'bootstrap/dist/css/bootstrap.min.css';

const MessageList = ({ addMessage }) => {
  const token = localStorage.getItem('token');
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);
  const [error, setError] = useState(null);
  console.log("Token:", token);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/messages/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Response:", response);
        const userId = jwtDecode(token).user_id;
        console.log("User id from jwtDecode:",userId);
        const received = response.data.filter(message => message.recipient.id === userId);
        const sent = response.data.filter(message => message.sender.id === userId);

        setReceivedMessages(received);
        setSentMessages(sent);
      } catch (error) {
        console.error('There was an error fetching the messages!', error);
        setError(error);
      }
    };

    if (token) {
      fetchMessages().then((response) => {});
    }
  }, [token]);

  return (
    <div className="container mt-5">
      <h2 className="text-center">Messages</h2>
      {error && <div className="alert alert-danger">{error.message}</div>}

      <div className="mt-5">
        <h3>Received Messages</h3>
        {receivedMessages.length === 0 && <p>No received messages yet.</p>}
        <ul className="list-group">
          {receivedMessages.map(message => (
            <li key={message.id} className="list-group-item">
              <strong>From:</strong> {message.sender.username} <br />
              <strong>Message:</strong> {message.content}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5">
        <h3>Sent Messages</h3>
        {sentMessages.length === 0 && <p>No sent messages yet.</p>}
        <ul className="list-group">
          {sentMessages.map(message => (
            <li key={message.id} className="list-group-item">
              <strong>From:</strong> Me <br />
              <strong>To:</strong> {message.recipient.username} <br />
              <strong>Message:</strong> {message.content}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MessageList;