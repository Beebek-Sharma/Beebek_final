import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import FeedbackForm from '../components/FeedbackForm';
import UserFeedbackList from '../components/UserFeedbackList';

const UserFeedback = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Feedback Center</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <FeedbackForm />
        </div>
        <div>
          <UserFeedbackList />
        </div>
      </div>
    </div>
  );
};

export default UserFeedback;
