import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { useAuth } from '../context/AuthContext';

const UserFeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axiosInstance.get('/feedback/');
        
        console.log('Feedbacks response data:', response.data);
        setFeedbacks(response.data);
      } catch (error) {
        console.error('Error fetching feedbacks:', error.response?.data || error.message);
        if (error.response?.status === 401) {
          setError('Your session has expired. Please log in again.');
        } else {
          setError(`Failed to load feedbacks: ${error.response?.data?.error || error.message || 'Unknown error'}`);
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchFeedbacks();
    } else {
      setError('You need to be logged in to view feedbacks');
      setLoading(false);
    }
  }, [user]);

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

  if (feedbacks.length === 0) {
    return <div className="text-center py-4">You haven't submitted any feedback yet.</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Your Feedback History</h2>
      {feedbacks.map((feedback) => (
        <div key={feedback.id} className="bg-white dark:bg-github-dark p-4 rounded-lg shadow dark:border-github-darkBorder-md">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold">{feedback.subject}</h3>
            <span className={`px-2 py-1 rounded text-xs ${
              feedback.is_resolved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {feedback.is_resolved ? 'Resolved' : 'Pending'}
            </span>
          </div>
          <p className="text-gray-600 dark:text-github-darkText mt-2">{feedback.message}</p>
          <div className="text-sm text-gray-500 dark:text-github-darkText mt-2">
            Submitted on: {new Date(feedback.created_at).toLocaleDateString()}
          </div>
          
          {feedback.responses && feedback.responses.length > 0 && (
            <div className="mt-4 border-t pt-4">
              <h4 className="text-md font-semibold mb-2">Admin Responses:</h4>
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
        </div>
      ))}
    </div>
  );
};

export default UserFeedbackList;
