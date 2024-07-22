import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const SendMessage = ({ addMessage }) => {
  const [formData, setFormData] = useState({
    recipient: '',
    content: '',
  });
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/users/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('There was an error fetching the users!', error);
        setError(error);
      }
    };

    if (token) {
      fetchUsers().then(r => {});
    }
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log('Sending message with data:', formData);

    try {
      const response = await axios.post('http://localhost:8000/api/messages/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Message sent successfully');
      setFormData({ recipient: '', content: '' });

      const responseData = response.data;
      console.log('Response data:', responseData);

      if (responseData.sender && responseData.recipient) {
        addMessage(responseData);
      } else {
        console.error('Response data is missing sender or recipient');
      }
    } catch (error) {
      console.error('There was an error sending the message!', error);
      setError(error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Send Message</h2>
      {error && <div className="alert alert-danger">{error.message}</div>}
      <form onSubmit={handleFormSubmit}>
        <div className="mb-3">
          <label className="form-label">Recipient</label>
          <select
            className="form-select"
            name="recipient"
            value={formData.recipient}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a user</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.username}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Content</label>
          <textarea
            className="form-control"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Send</button>
      </form>
    </div>
  );
};

export default SendMessage;