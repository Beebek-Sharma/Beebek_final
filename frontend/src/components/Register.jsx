// src/components/Register.jsx
import React from 'react';
import { useState } from 'react';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { getCSRFToken } = require('../utils/csrf');
  const handleRegister = async (e) => {
    e.preventDefault();
    const csrftoken = getCSRFToken();
    const response = await fetch('http://localhost:8000/api/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken
      },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    });

    if (response.ok) {
      alert('Registration successful!');
    } else {
      alert('Registration failed');
    }
  };

  return (
    <form onSubmit={handleRegister} className="flex flex-col gap-2 max-w-sm mx-auto mt-10">
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" className="border p-2" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="border p-2" />
      <button type="submit" className="bg-green-500 text-white p-2 rounded">Register</button>
    </form>
  );
}

export default Register;