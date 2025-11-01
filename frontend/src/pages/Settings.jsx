import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { validateName, validateUsername, validateBio, validateProfileUpdate } from '../utils/validation';

export default function Settings() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [username, setUsername] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [bio, setBio] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [notifications, setNotifications] = useState({
    transactional: true,
    marketing: true
  });
  const [serverLocation, setServerLocation] = useState('Asia');
  
  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
      setFirstName(user.first_name || '');
      setLastName(user.last_name || '');
      setBio(user.bio || '');
      // Set profile picture preview if available
      if (user.profile_picture) {
        // Add a cache-busting parameter to force reload of the image
        setPreview(`${user.profile_picture}?t=${new Date().getTime()}`);
        console.log("Profile picture URL:", user.profile_picture);
      }
    }
  }, [user]);

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Validate using utility functions
    const validationErrors = validateProfileUpdate({
      first_name: firstName,
      last_name: lastName,
      bio: bio
    });
    
    if (Object.keys(validationErrors).length > 0) {
      // Show first error
      const firstError = Object.values(validationErrors)[0];
      setError(firstError);
      return;
    }

    try {
      // Profile picture upload
      if (profilePic) {
        const formData = new FormData();
        formData.append('image', profilePic);
        const pictureResponse = await axios.post('/api/auth/upload-profile-picture/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        });
        
        // If we got back a URL, update the preview
        if (pictureResponse.data.profile_picture_url) {
          // Add a cache-busting parameter to force reload of the image
          setPreview(`${pictureResponse.data.profile_picture_url}?t=${new Date().getTime()}`);
          console.log("New profile picture URL:", pictureResponse.data.profile_picture_url);
        }
      }
      
      // Update first name and last name if changed
      if (firstName !== user.first_name || lastName !== user.last_name || bio !== user.bio) {
        const response = await axios.post('/api/auth/update-profile/', {
          first_name: firstName,
          last_name: lastName,
          bio: bio
        }, { withCredentials: true });
        
        if (response.data.errors) {
          const firstError = Object.values(response.data.errors)[0];
          setError(firstError);
          return;
        }
      }
      
      setMessage('Profile updated successfully!');
      refreshUser(); // Refresh user data
    } catch (err) {
      console.error("Profile update error:", err);
      if (err.response?.data?.errors) {
        const firstError = Object.values(err.response.data.errors)[0];
        setError(firstError);
      } else {
        setError(err.response?.data?.error || 'Error updating profile');
      }
    }
  };

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    // Validate username
    const usernameErrors = validateUsername(username);
    if (usernameErrors.length > 0) {
      setError(usernameErrors[0]);
      return;
    }
    
    try {
      if (username && username !== user.username) {
        const res = await axios.post('/api/auth/edit-username/', { username }, { withCredentials: true });
        if (res.data.success) {
          setMessage('Username updated successfully!');
          refreshUser(); // Refresh user data
        } else {
          setError(res.data.error || 'Error updating username');
        }
      } else {
        setError('Please enter a new username');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error updating username');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    if (newPassword !== confirmPassword) {
      setError("New passwords don't match");
      return;
    }
    
    try {
      const res = await axios.post('/api/auth/change-password/', {
        current_password: currentPassword,
        new_password: newPassword
      }, { withCredentials: true });
      
      if (res.data.success) {
        setMessage('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(res.data.error || 'Error updating password');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error updating password');
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    // Email change functionality would go here
    // For now we'll just show an info message
    setMessage('Email changes require verification. This feature is coming soon.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Settings
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Manage your account preferences and profile information
          </p>
        </motion.div>

        {/* Settings Navigation Cards */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          <button
            onClick={() => setActiveTab('profile')}
            className={`p-6 rounded-xl shadow-lg text-center transition group ${
              activeTab === 'profile'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                : 'bg-white dark:bg-gray-800 hover:shadow-xl'
            }`}
          >
            <div className="text-4xl mb-3">
              {activeTab === 'profile' ? '👤' : '👤'}
            </div>
            <h3 className={`font-semibold text-lg ${
              activeTab === 'profile'
                ? 'text-white'
                : 'text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400'
            }`}>
              Profile Settings
            </h3>
            <p className={`text-sm mt-2 ${
              activeTab === 'profile'
                ? 'text-blue-100'
                : 'text-gray-500 dark:text-gray-400'
            }`}>
              Update your personal information
            </p>
          </button>

          <button
            onClick={() => setActiveTab('account')}
            className={`p-6 rounded-xl shadow-lg text-center transition group ${
              activeTab === 'account'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                : 'bg-white dark:bg-gray-800 hover:shadow-xl'
            }`}
          >
            <div className="text-4xl mb-3">
              {activeTab === 'account' ? '⚙️' : '⚙️'}
            </div>
            <h3 className={`font-semibold text-lg ${
              activeTab === 'account'
                ? 'text-white'
                : 'text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400'
            }`}>
              Account Settings
            </h3>
            <p className={`text-sm mt-2 ${
              activeTab === 'account'
                ? 'text-blue-100'
                : 'text-gray-500 dark:text-gray-400'
            }`}>
              Manage security and preferences
            </p>
          </button>

          <button
            onClick={() => setActiveTab('billing')}
            className={`p-6 rounded-xl shadow-lg text-center transition group ${
              activeTab === 'billing'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                : 'bg-white dark:bg-gray-800 hover:shadow-xl'
            }`}
          >
            <div className="text-4xl mb-3">
              {activeTab === 'billing' ? '💳' : '💳'}
            </div>
            <h3 className={`font-semibold text-lg ${
              activeTab === 'billing'
                ? 'text-white'
                : 'text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400'
            }`}>
              Billing & Data
            </h3>
            <p className={`text-sm mt-2 ${
              activeTab === 'billing'
                ? 'text-blue-100'
                : 'text-gray-500 dark:text-gray-400'
            }`}>
              Export and manage your data
            </p>
          </button>
        </motion.div>

        {/* Messages */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
          >
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="text-green-700 dark:text-green-400">{message}</p>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-600 dark:text-red-400 mr-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-red-700 dark:text-red-400">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Settings Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">
              {activeTab === 'profile' && 'Profile Settings'}
              {activeTab === 'account' && 'Account Settings'}
              {activeTab === 'billing' && 'Billing & Data Export'}
            </h2>
            <p className="text-blue-100 mt-1">
              {activeTab === 'profile' && 'Update your personal information and profile picture'}
              {activeTab === 'account' && 'Manage your account security and preferences'}
              {activeTab === 'billing' && 'Export your data and manage billing'}
            </p>
          </div>

          <div className="p-8">
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center space-x-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex-shrink-0">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Profile"
                        className="h-24 w-24 rounded-full object-cover border-4 border-blue-500"
                      />
                    ) : user?.profile_picture ? (
                      <img
                        src={user.profile_picture}
                        alt="Profile"
                        className="h-24 w-24 rounded-full object-cover border-4 border-blue-500"
                      />
                    ) : (
                      <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                        {user?.first_name?.[0] || user?.username?.[0] || '?'}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Profile Picture
                    </h3>
                    <label className="cursor-pointer bg-white dark:bg-gray-700 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition">
                      <span>Change Picture</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handlePicChange}
                      />
                    </label>
                  </div>
                </div>

                {/* Name Fields */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
                      required
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bio ({140 - bio.length} characters remaining)
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value.substring(0, 140))}
                    rows="4"
                    maxLength="140"
                    placeholder="Tell us about yourself..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-end pt-4">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-medium shadow-lg"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}
            
            {activeTab === 'account' && (
              <div className="space-y-8">
                {/* Username Section */}
                <div className="pb-8 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Username
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Update your username (one-time change available)
                  </p>
                  <form onSubmit={handleUsernameSubmit} className="flex gap-4">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-medium"
                    >
                      Update
                    </button>
                  </form>
                </div>

                {/* Email Section */}
                <div className="pb-8 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Email Address
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Your email is used for account recovery and notifications
                  </p>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white opacity-75 cursor-not-allowed"
                  />
                </div>

                {/* Password Section */}
                <div className="pb-8 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Change Password
                  </h3>
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-medium"
                      >
                        Update Password
                      </button>
                    </div>
                  </form>
                </div>

                {/* Server Location */}
                <div className="pb-8 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Server Location
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Choose your preferred server region
                  </p>
                  <select
                    value={serverLocation}
                    onChange={(e) => setServerLocation(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
                  >
                    <option value="Asia">Asia</option>
                    <option value="Europe">Europe</option>
                    <option value="North America">North America</option>
                    <option value="South America">South America</option>
                    <option value="Africa">Africa</option>
                    <option value="Oceania">Oceania</option>
                  </select>
                </div>

                {/* Notifications */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Email Notifications
                  </h3>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          Transactional Emails
                        </span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Account security and important updates
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.transactional}
                        onChange={() => setNotifications({ ...notifications, transactional: !notifications.transactional })}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          Marketing Emails
                        </span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          New features and product updates
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.marketing}
                        onChange={() => setNotifications({ ...notifications, marketing: !notifications.marketing })}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'billing' && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-10 h-10 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Export Your Data
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
                  Download all your personal data including profile information, saved courses, and activity history
                </p>
                <button className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-medium shadow-lg">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  Start Export
                </button>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  Export typically completes within a few minutes
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
