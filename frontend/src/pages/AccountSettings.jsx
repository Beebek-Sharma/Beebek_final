import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function AccountSettings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [notifications, setNotifications] = useState({
    transactional: true,
    marketing: true,
    promotions: false,
    updates: true,
  });
  const [serverLocation, setServerLocation] = useState('Asia');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
    }
  }, [user]);

  const handleNotificationChange = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSaveAccountSettings = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/auth/account-settings/`,
        {
          email,
          notifications,
          server_location: serverLocation,
        }
      );

      setMessage('Account settings updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Account settings update error:', err);
      setError(err.response?.data?.error || 'Failed to update account settings');
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/40 dark:bg-gray-800/40 rounded-2xl shadow-xl overflow-hidden border border-white/30 dark:border-gray-700/30">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
            <h1 className="text-3xl font-bold text-white">Account Settings</h1>
            <p className="text-blue-100 mt-2">Manage your account preferences</p>
          </div>

          <div className="p-8">
            {message && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-green-700 dark:text-green-400">{message}</p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}

            <form onSubmit={handleSaveAccountSettings} className="space-y-8">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
                  required
                />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  We'll send important updates to this email
                </p>
              </div>

              {/* Server Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preferred Server Location
                </label>
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
                  <option value="Australia">Australia</option>
                </select>
              </div>

              {/* Notification Preferences */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Notification Preferences
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
                      onChange={() => handleNotificationChange('transactional')}
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
                      onChange={() => handleNotificationChange('marketing')}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        Promotions
                      </span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Special offers and discounts
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.promotions}
                      onChange={() => handleNotificationChange('promotions')}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        Course Updates
                      </span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        New courses and university information
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.updates}
                      onChange={() => handleNotificationChange('updates')}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/settings')}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
