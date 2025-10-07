// src/components/Login.jsx
import React from 'react';
import { useState } from 'react';

function Login({ setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { getCSRFToken } = require('../utils/csrf');
  const handleLogin = async (e) => {
    e.preventDefault();
    const csrftoken = getCSRFToken();
    const response = await fetch('http://localhost:8000/api/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken
      },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (data.access) {
      localStorage.setItem('accessToken', data.access);
      setToken(data.access);
    } else {
      alert('Login failed');
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-2 max-w-sm mx-auto mt-10">
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" className="border p-2" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="border p-2" />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">Login</button>
    </form>
  );
}

export default Login;