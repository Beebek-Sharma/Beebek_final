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
