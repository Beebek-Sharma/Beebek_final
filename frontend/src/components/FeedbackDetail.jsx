import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiUser, FiMail, FiCalendar, FiMessageSquare, FiCheckCircle, FiClock, FiSend } from 'react-icons/fi';
import axiosInstance from '../utils/axiosConfig';

const FeedbackDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchFeedbackDetail();
  }, [id]);

  const fetchFeedbackDetail = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/feedback/${id}/`);
      setFeedback(response.data);
    } catch (error) {
      console.error('Error fetching feedback detail:', error);
      setError(error.response?.data?.error || 'Failed to load feedback details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    
    if (!responseMessage.trim()) {
      return;
    }

    setSubmitting(true);
    setSuccess(false);

    try {
      await axiosInstance.post(`/feedback/${id}/respond/`, {
        message: responseMessage
      });
      
      setSuccess(true);
      setResponseMessage('');
      
      // Refresh feedback to show new response
      await fetchFeedbackDetail();
      
      // Auto-hide success message
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error submitting response:', error);
      setError(error.response?.data?.error || 'Failed to submit response');
      setTimeout(() => setError(''), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkResolved = async () => {
    try {
      await axiosInstance.put(`/feedback/${id}/`, {
        is_resolved: !feedback.is_resolved
      });
      
      // Refresh feedback
      await fetchFeedbackDetail();
    } catch (error) {
      console.error('Error updating feedback status:', error);
      setError('Failed to update feedback status');
      setTimeout(() => setError(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-github-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading feedback details...</p>
        </div>
      </div>
    );
  }

  if (error && !feedback) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-github-dark flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-github-darkCard rounded-lg shadow-lg p-8 max-w-md w-full text-center"
        >
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/admin/feedback')}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Back to Feedback List
          </button>
        </motion.div>
      </div>
    );
  }

  if (!feedback) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-github-dark">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12">
        <div className="max-w-5xl mx-auto px-4">
          <button
            onClick={() => navigate('/admin/feedback')}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors group"
          >
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to Feedback List
          </button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">{feedback.subject}</h1>
              <div className="flex items-center gap-4 text-white/80">
                <span className="flex items-center gap-2">
                  <FiUser size={16} />
                  {feedback.username || feedback.user_email || 'Anonymous'}
                </span>
                <span className="flex items-center gap-2">
                  <FiCalendar size={16} />
                  {new Date(feedback.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
            
            <button
              onClick={handleMarkResolved}
              className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                feedback.is_resolved
                  ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {feedback.is_resolved ? (
                <>
                  <FiClock size={18} />
                  Mark as Pending
                </>
              ) : (
                <>
                  <FiCheckCircle size={18} />
                  Mark as Resolved
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Feedback Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-github-darkCard rounded-lg shadow-lg p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <FiMessageSquare className="text-primary-600" size={24} />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Feedback Message</h2>
              </div>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {feedback.message}
                </p>
              </div>
            </motion.div>

            {/* Responses */}
            {feedback.responses && feedback.responses.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-github-darkCard rounded-lg shadow-lg p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Previous Responses ({feedback.responses.length})
                </h3>
                <div className="space-y-4">
                  {feedback.responses.map((response, index) => (
                    <motion.div
                      key={response.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 border-l-4 border-emerald-500"
                    >
                      <p className="text-gray-700 dark:text-gray-300 mb-2">{response.message}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <FiCalendar size={14} />
                        {new Date(response.created_at).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Response Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-github-darkCard rounded-lg shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Add Response
              </h3>
              
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-200"
                >
                  Response submitted successfully!
                </motion.div>
              )}
              
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmitResponse}>
                <textarea
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  placeholder="Type your response here..."
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-github-dark dark:text-white resize-none"
                  disabled={submitting}
                />
                
                <div className="mt-4 flex justify-end">
                  <motion.button
                    type="submit"
                    disabled={submitting || !responseMessage.trim()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all flex items-center gap-2 font-semibold"
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <FiSend size={18} />
                        Send Response
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-github-darkCard rounded-lg shadow-lg p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Status</h3>
              <div className={`px-4 py-2 rounded-lg text-center font-semibold ${
                feedback.is_resolved
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
              }`}>
                {feedback.is_resolved ? (
                  <div className="flex items-center justify-center gap-2">
                    <FiCheckCircle size={20} />
                    Resolved
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <FiClock size={20} />
                    Pending
                  </div>
                )}
              </div>
            </motion.div>

            {/* User Info Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-github-darkCard rounded-lg shadow-lg p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">User Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <FiUser className="text-gray-400" size={18} />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Username</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {feedback.username || 'Anonymous'}
                    </p>
                  </div>
                </div>
                {feedback.user_email && (
                  <div className="flex items-center gap-3">
                    <FiMail className="text-gray-400" size={18} />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                      <p className="text-gray-900 dark:text-white font-medium break-all">
                        {feedback.user_email}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <FiCalendar className="text-gray-400" size={18} />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Submitted</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {new Date(feedback.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-github-darkCard rounded-lg shadow-lg p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Total Responses</span>
                  <span className="font-bold text-primary-600 dark:text-primary-400">
                    {feedback.responses?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Days Since Submitted</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {Math.floor((new Date() - new Date(feedback.created_at)) / (1000 * 60 * 60 * 24))}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackDetail;
