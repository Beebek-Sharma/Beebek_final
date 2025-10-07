import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { useAuth } from '../context/AuthContext';

const AdminFeedbackManager = () => {
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
      const response = await axiosInstance.patch(
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
    return <div className="text-center py-4">Loading feedbacks...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  const filteredFeedbacks = feedbacks.filter(feedback => 
    activeTab === 'pending' ? !feedback.is_resolved : feedback.is_resolved
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Manage Student Feedback</h2>
      
      <div className="flex border-b">
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'pending' 
            ? 'border-b-2 border-blue-500 text-blue-600' 
            : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'resolved' 
            ? 'border-b-2 border-blue-500 text-blue-600' 
            : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('resolved')}
        >
          Resolved
        </button>
      </div>
      
      {filteredFeedbacks.length === 0 ? (
        <div className="text-center py-4">
          No {activeTab} feedback at this time.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFeedbacks.map((feedback) => (
            <div key={feedback.id} className="bg-white dark:bg-github-dark p-6 rounded-lg shadow dark:border-github-darkBorder-md">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold">{feedback.subject}</h3>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  feedback.resolved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {feedback.resolved ? 'Resolved' : 'Pending'}
                </span>
              </div>
              
              <div className="mt-2">
                <span className="text-sm text-gray-600 dark:text-github-darkText">
                  From: {feedback.user_email || 'Anonymous'} | 
                  Submitted: {new Date(feedback.created_at).toLocaleDateString()}
                </span>
              </div>
              
              <p className="text-gray-700 dark:text-github-darkText mt-3 p-3 bg-gray-50 dark:bg-github-dark rounded">
                {feedback.message}
              </p>
              
              {feedback.responses && feedback.responses.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-md font-semibold mb-2">Previous Responses:</h4>
                  {feedback.responses.map((response) => (
                    <div key={response.id} className="bg-blue-50 p-3 rounded mt-2">
                      <p>{response.message}</p>
                      <div className="text-sm text-gray-500 dark:text-github-darkText mt-1">
                        Responded on: {new Date(response.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex space-x-2">
                  <button
                    onClick={() => markAsResolved(feedback.id, feedback.is_resolved)}
                    className={`px-3 py-1 rounded text-sm ${
                      feedback.is_resolved 
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    {feedback.is_resolved ? 'Mark as Pending' : 'Mark as Resolved'}
                  </button>
                </div>
                
                {!feedback.is_resolved && (
                  <div className="mt-4">
                    <label htmlFor={`response-${feedback.id}`} className="block text-sm font-medium text-gray-700 dark:text-github-darkText mb-2">
                      Respond to this feedback:
                    </label>
                    <textarea
                      id={`response-${feedback.id}`}
                      rows="3"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={responseMessages[feedback.id] || ''}
                      onChange={(e) => handleInputChange(feedback.id, e.target.value)}
                      placeholder="Type your response here..."
                    ></textarea>
                    
                    <div className="mt-2 flex justify-end">
                      {success[feedback.id] && (
                        <span className="text-green-600 mr-4 self-center">Response sent successfully!</span>
                      )}
                      <button
                        onClick={() => handleSubmitResponse(feedback.id)}
                        disabled={submitting[feedback.id] || !responseMessages[feedback.id]}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        {submitting[feedback.id] ? 'Sending...' : 'Send Response'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminFeedbackManager;
