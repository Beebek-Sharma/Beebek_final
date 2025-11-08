import React from 'react';
import { useAuth } from '../context/AuthContext';
import FeedbackForm from '../components/FeedbackForm';
import UserFeedbackList from '../components/UserFeedbackList';


const UserFeedback = () => {
  const { user, loading } = useAuth();

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8 mt-2">Feedback Center</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 p-6">
          <FeedbackForm />
        </div>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 p-6">
          <UserFeedbackList />
        </div>
      </div>
    </div>
  );
};

export default UserFeedback;
