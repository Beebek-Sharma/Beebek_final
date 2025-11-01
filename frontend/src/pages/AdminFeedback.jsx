import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiGrid, FiBookOpen, FiUsers, FiMessageSquare } from 'react-icons/fi';
import Footer from '../components/Footer';
import AdminFeedbackManager from '../components/AdminFeedbackManager';

const AdminFeedback = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState('feedback');
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-github-dark flex flex-col">
      {/* Modern Gradient Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12 mb-8">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-6"
          >
            Admin Feedback Management
          </motion.h1>
          
          {/* Navigation Tabs */}
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex gap-3 flex-wrap"
          >
            <button
              onClick={() => navigate('/admin')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'universities'
                  ? 'bg-white text-primary-600 shadow-lg'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <FiGrid size={20} />
              Universities
            </button>
            <button
              onClick={() => navigate('/admin?tab=courses')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'courses'
                  ? 'bg-white text-primary-600 shadow-lg'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <FiBookOpen size={20} />
              Courses
            </button>
            <button
              onClick={() => navigate('/admin?tab=users')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'users'
                  ? 'bg-white text-primary-600 shadow-lg'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <FiUsers size={20} />
              Users
            </button>
            <button
              onClick={() => setActiveTab('feedback')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'feedback'
                  ? 'bg-white text-primary-600 shadow-lg'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <FiMessageSquare size={20} />
              Feedback
            </button>
          </motion.nav>
        </div>
      </div>
      
      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-6xl mx-auto px-6 pb-12 w-full"
      >
        {activeTab === 'feedback' && <AdminFeedbackManager />}
      </motion.div>
    </div>
  );
};

export default AdminFeedback;
