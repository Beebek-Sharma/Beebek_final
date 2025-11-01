import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function EditUsername() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Username validation
    const nameRegex = /^[A-Za-z0-9_]{3,}$/;
    if (!nameRegex.test(username)) {
      setError('Username must be at least 3 characters and contain only letters, numbers, or underscores.');
      return;
    }

    if (username === user?.username) {
      setError('This is already your current username');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post('/api/auth/edit-username/', { username }, { withCredentials: true });
      
      if (res.data.success) {
        setMessage('Username updated successfully!');
        await refreshUser(); // Refresh user data
        
        // Redirect to settings after a short delay
        setTimeout(() => {
          navigate('/settings');
        }, 2000);
      } else {
        setError(res.data.error || 'Error updating username');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error updating username');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-github-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white dark:bg-github-darkSecondary rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Edit Username</h2>

          <div className="mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Current username: <span className="font-semibold text-gray-900 dark:text-white">{user?.username}</span>
            </p>
          </div>

          {message && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter new username"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
                disabled={loading}
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Username must be at least 3 characters and contain only letters, numbers, or underscores.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Update Username'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/settings')}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-4 rounded-lg transition duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
