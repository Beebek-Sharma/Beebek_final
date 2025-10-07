import React from 'react';

import Footer from '../components/Footer';
import AdminFeedbackManager from '../components/AdminFeedbackManager';

const AdminFeedback = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-github-dark flex flex-col">
      <h1 className="text-3xl font-bold mb-8 pt-2">Admin Feedback Management</h1>
      <AdminFeedbackManager />
      <div className="mt-auto">
  {/* Footer removed: now only rendered in App.jsx */}
      </div>
    </div>
  );
};

export default AdminFeedback;
