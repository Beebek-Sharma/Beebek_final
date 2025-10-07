// src/components/CreatePost.jsx
import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const { getCSRFToken } = require('../utils/csrf');
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    const csrftoken = getCSRFToken();

    const res = await fetch('http://localhost:8000/api/posts/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-CSRFToken': csrftoken
      },
      credentials: 'include',
      body: JSON.stringify({ title, content })
    });

    if (res.ok) {
      navigate('/');
    } else {
      alert('Post creation failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-lg mx-auto mt-10">
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="border p-2" />
      <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Content" className="border p-2 h-40" />
      <button type="submit" className="bg-blue-600 text-white p-2 rounded">Create Post</button>
    </form>
  );
}