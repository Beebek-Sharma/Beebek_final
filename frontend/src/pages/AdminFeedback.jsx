import React from 'react';
import { useNavigate } from 'react-router-dom';

import Footer from '../components/Footer';
import AdminFeedbackManager from '../components/AdminFeedbackManager';

const AdminFeedback = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState('feedback');
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-github-dark flex flex-col">
      {/* Heading and Tabs OUTSIDE the card */}
      <div className="w-full max-w-3xl mx-auto mt-10">
  <h1 className="text-4xl font-bold mb-8 dark:text-github-lightText">Admin Feedback Management</h1>
        <div className="flex justify-start mb-8">
          <nav className="flex gap-6">
            <button
              onClick={() => navigate('/admin')}
              className={`px-6 py-2 rounded-full font-semibold shadow transition-all text-lg ${
                activeTab === 'universities'
                  ? 'bg-[#4f46e5] text-white dark:bg-[#4f46e5] dark:text-white'
                  : 'bg-white text-gray-700 hover:bg-[#eef2ff] dark:bg-github-darkAccent dark:text-github-lightText dark:hover:bg-github-darkBorder'
              }`}
            >
              Universities
            </button>
            <button
              onClick={() => navigate('/admin?tab=courses')}
              className={`px-6 py-2 rounded-full font-semibold shadow transition-all text-lg ${
                activeTab === 'courses'
                  ? 'bg-[#4f46e5] text-white dark:bg-[#4f46e5] dark:text-white'
                  : 'bg-white text-gray-700 hover:bg-[#eef2ff] dark:bg-github-darkAccent dark:text-github-lightText dark:hover:bg-github-darkBorder'
              }`}
            >
              Courses
            </button>
            <button
              onClick={() => navigate('/admin?tab=users')}
              className={`px-6 py-2 rounded-full font-semibold shadow transition-all text-lg ${
                activeTab === 'users'
                  ? 'bg-[#4f46e5] text-white dark:bg-[#4f46e5] dark:text-white'
                  : 'bg-white text-gray-700 hover:bg-[#eef2ff] dark:bg-github-darkAccent dark:text-github-lightText dark:hover:bg-github-darkBorder'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('feedback')}
              className={`px-6 py-2 rounded-full font-semibold shadow transition-all text-lg ${
                activeTab === 'feedback'
                  ? 'bg-[#4f46e5] text-white dark:bg-[#4f46e5] dark:text-white'
                  : 'bg-white text-gray-700 hover:bg-[#eef2ff] dark:bg-github-darkAccent dark:text-github-lightText dark:hover:bg-github-darkBorder'
              }`}
            >
              Feedback
            </button>
          </nav>
        </div>
      </div>
      {/* Card */}
      <div className="p-8 rounded-2xl shadow-md bg-github-lightAccent dark:bg-github-darkAccent text-github-lightText dark:text-github-darkText transition-colors duration-300 mx-auto w-full max-w-3xl">
        {activeTab === 'feedback' && <AdminFeedbackManager />}
        {/* You can add content for other tabs here if needed */}
      </div>
      <div className="mt-auto">
        {/* Footer removed: now only rendered in App.jsx */}
      </div>
    </div>
  );
};

export default AdminFeedback;
