import React from 'react';
import AdminFeedbackManager from '../components/AdminFeedbackManager';

const AdminFeedback = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Admin Feedback Management</h1>
      <AdminFeedbackManager />
    </div>
  );
};

export default AdminFeedback;
