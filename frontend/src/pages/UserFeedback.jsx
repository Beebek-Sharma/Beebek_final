import React from 'react';
import { useUser } from '@clerk/clerk-react';
import FeedbackForm from '../components/FeedbackForm';
import UserFeedbackList from '../components/UserFeedbackList';
import Header from '../components/Header';

const UserFeedback = () => {
  const { user, isLoaded } = useUser();

  return (
    <div className="container mx-auto">
      <Header />
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
