import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function EditProfile() {
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');
  const { refreshUser } = useAuth();

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    // Username validation
    if (username) {
      const nameRegex = /^[A-Za-z0-9_]{3,}$/;
      if (!nameRegex.test(username)) {
        setMessage('Username must be at least 3 characters and contain only letters, numbers, or underscores.');
        return;
      }
    }
    try {
      // Profile picture upload
      if (profilePic) {
        const formData = new FormData();
        formData.append('image', profilePic);
        await axios.post('/api/auth/upload-profile-picture/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        });
      }
      // Username update
      if (username) {
        const res = await axios.post('/api/auth/edit-username/', { username }, { withCredentials: true });
        if (res.data.success) setMessage('Profile updated successfully!');
        else setMessage(res.data.error || 'Error updating profile');
      }
      // Bio update
      if (bio) {
        await axios.post('/api/auth/update-profile/', { bio }, { withCredentials: true });
      }
      // Refresh user context so profile page updates immediately
      await refreshUser();
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage('Error updating profile');
    }
  };

  return (
    <div className="panel p-8 rounded-xl shadow-lg" style={{ backgroundColor: '#23242B', color: '#E0E0E0' }}>
      <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label>
          Username
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="mt-1 p-2 rounded bg-gray-800 text-white w-full" />
        </label>
        <label>
          Bio
          <textarea value={bio} onChange={e => setBio(e.target.value)} className="mt-1 p-2 rounded bg-gray-800 text-white w-full" rows={3} placeholder="Write something about yourself..." />
        </label>
        <label>
          Profile Picture
          <input type="file" accept="image/*" onChange={handlePicChange} className="mt-1" />
        </label>
        {preview && <img src={preview} alt="Preview" className="mt-2 w-24 h-24 rounded-full object-cover" />}
        <button type="submit" className="panel px-4 py-2 rounded-lg shadow-md font-semibold">Save Changes</button>
        {message && <div className="mt-2 text-green-400">{message}</div>}
      </form>
    </div>
  );
}
