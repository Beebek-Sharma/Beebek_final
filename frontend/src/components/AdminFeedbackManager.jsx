import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiUser, FiCalendar, FiCheckCircle, FiClock, FiSend, FiMail } from 'react-icons/fi';
import axiosInstance from '../utils/axiosConfig';
import { useAuth } from '../context/AuthContext';

const AdminFeedbackManager = () => {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [responseMessages, setResponseMessages] = useState({});
  const [submitting, setSubmitting] = useState({});
  const [success, setSuccess] = useState({});
  const [activeTab, setActiveTab] = useState('pending');
  const { user, isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    fetchFeedbacks();
  }, [user]);

  const fetchFeedbacks = async () => {
    try {
      const response = await axiosInstance.get('/feedback/');
      setFeedbacks(response.data);
    } catch (error) {
      console.error('Error fetching admin feedbacks:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
      } else {
        setError(`Failed to load feedbacks: ${error.response?.data?.error || error.message || 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (feedbackId, value) => {
    setResponseMessages({
      ...responseMessages,
      [feedbackId]: value,
    });
  };

  const handleSubmitResponse = async (feedbackId) => {
    if (!responseMessages[feedbackId] || responseMessages[feedbackId].trim() === '') {
      return;
    }

    setSubmitting({ ...submitting, [feedbackId]: true });
    setSuccess({ ...success, [feedbackId]: false });

    try {
      const response = await axiosInstance.post(
        `/feedback/${feedbackId}/respond/`,
        { message: responseMessages[feedbackId] }
      );
      setSuccess({ ...success, [feedbackId]: true });
      setResponseMessages({ ...responseMessages, [feedbackId]: '' });
      fetchFeedbacks();
    } catch (error) {
      console.error('Error submitting response:', error.response?.data || error.message);
      alert(`Error responding to feedback: ${error.response?.data?.error || error.message || 'Unknown error'}`);
    } finally {
      setSubmitting({ ...submitting, [feedbackId]: false });
    }
  };

  const markAsResolved = async (feedbackId, currentStatus) => {
    try {
      const response = await axiosInstance.put(
        `/feedback/${feedbackId}/`,
        { is_resolved: !currentStatus }
      );
      fetchFeedbacks();
    } catch (error) {
      console.error('Error updating feedback status:', error.response?.data || error.message);
      alert(`Error updating status: ${error.response?.data?.error || error.message || 'Unknown error'}`);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading feedbacks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-6 py-4 rounded-lg"
      >
        <p className="font-semibold">Error</p>
        <p className="text-sm mt-1">{error}</p>
      </motion.div>
    );
  }

  const filteredFeedbacks = feedbacks.filter(feedback => 
    activeTab === 'pending' ? !feedback.is_resolved : feedback.is_resolved
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <FiMessageSquare className="text-primary-600 dark:text-primary-400" size={32} />
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Student Feedback</h2>
      </div>
      
      {/* Modern Tab Navigation */}
      <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg w-fit">
        <button
          className={`px-6 py-2.5 rounded-md font-semibold transition-all ${
            activeTab === 'pending'
              ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
          onClick={() => setActiveTab('pending')}
        >
          <div className="flex items-center gap-2">
            <FiClock size={18} />
            Pending
          </div>
        </button>
        <button
          className={`px-6 py-2.5 rounded-md font-semibold transition-all ${
            activeTab === 'resolved'
              ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
          onClick={() => setActiveTab('resolved')}
        >
          <div className="flex items-center gap-2">
            <FiCheckCircle size={18} />
            Resolved
          </div>
        </button>
      </div>
      
      {filteredFeedbacks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm"
        >
          <div className="text-gray-400 dark:text-gray-600 mb-4">
            {activeTab === 'pending' ? <FiClock size={48} className="mx-auto" /> : <FiCheckCircle size={48} className="mx-auto" />}
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            No {activeTab} feedback at this time.
          </p>
        </motion.div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="space-y-4">
            {filteredFeedbacks.map((feedback, index) => (
              <motion.div
                key={feedback.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="p-6 rounded-xl shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {feedback.subject}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <button
                        onClick={() => navigate(`/admin/feedback/${feedback.id}`)}
                        className="flex items-center gap-1 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 rounded px-1"
                      >
                        <FiUser size={14} />
                        {feedback.username || feedback.user_email || 'Anonymous'}
                      </button>
                      <span className="flex items-center gap-1">
                        <FiCalendar size={14} />
                        {new Date(feedback.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap ${
                      feedback.is_resolved
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                    }`}
                  >
                    {feedback.is_resolved ? (
                      <span className="flex items-center gap-1">
                        <FiCheckCircle size={14} />
                        Resolved
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <FiClock size={14} />
                        Pending
                      </span>
                    )}
                  </span>
                </div>
                
                {/* Message */}
                <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {feedback.message}
                  </p>
                </div>
                
                {/* Previous Responses */}
                {feedback.responses && feedback.responses.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <FiMail size={16} />
                      Previous Responses ({feedback.responses.length})
                    </h4>
                    <div className="space-y-2">
                      {feedback.responses.map((response) => (
                        <motion.div
                          key={response.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border-l-4 border-emerald-500"
                        >
                          <p className="text-gray-700 dark:text-gray-300 text-sm">
                            {response.message}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <FiCalendar size={12} />
                            {new Date(response.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Actions */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => markAsResolved(feedback.id, feedback.is_resolved)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                        feedback.is_resolved
                          ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:hover:bg-yellow-900/50'
                          : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50'
                      }`}
                    >
                      {feedback.is_resolved ? (
                        <>
                          <FiClock size={16} />
                          Mark as Pending
                        </>
                      ) : (
                        <>
                          <FiCheckCircle size={16} />
                          Mark as Resolved
                        </>
                      )}
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(`/admin/feedback/${feedback.id}`)}
                      className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary-600 text-white hover:bg-primary-700 transition-all"
                    >
                      View Details
                    </motion.button>
                  </div>
                  
                  {/* Quick Response Form */}
                  {!feedback.is_resolved && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4"
                    >
                      <label
                        htmlFor={`response-${feedback.id}`}
                        className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Quick Response:
                      </label>
                      <textarea
                        id={`response-${feedback.id}`}
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-900 dark:text-white resize-none"
                        value={responseMessages[feedback.id] || ''}
                        onChange={(e) => handleInputChange(feedback.id, e.target.value)}
                        placeholder="Type your response here..."
                      />
                      
                      <div className="mt-3 flex justify-end items-center gap-3">
                        <AnimatePresence>
                          {success[feedback.id] && (
                            <motion.span
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0 }}
                              className="text-green-600 dark:text-green-400 text-sm font-medium flex items-center gap-1"
                            >
                              <FiCheckCircle size={16} />
                              Response sent successfully!
                            </motion.span>
                          )}
                        </AnimatePresence>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSubmitResponse(feedback.id)}
                          disabled={submitting[feedback.id] || !responseMessages[feedback.id]}
                          className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center gap-2"
                        >
                          {submitting[feedback.id] ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Sending...
                            </>
                          ) : (
                            <>
                              <FiSend size={16} />
                              Send Response
                            </>
                          )}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default AdminFeedbackManager;
