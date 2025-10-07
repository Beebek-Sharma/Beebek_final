import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';

const AdminPromoter = ({ onPromotionSuccess }) => {
  const { user, checkAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handlePromoteToAdmin = async () => {
    setLoading(true);
    setError('');
    
    try {
      console.log('[AdminPromoter] Current user:', user);
      console.log('[AdminPromoter] Promoting user to admin...');
      
      // Call backend to promote user to admin
      await axiosInstance.post('/auth/promote-to-admin/');
      
      console.log('[AdminPromoter] User promoted successfully');
      
      // Refresh user data
      await checkAuth();
      
      setSuccess(true);
      setError('');
      
      // Wait a moment for the metadata to propagate, then reload
      setTimeout(() => {
        if (onPromotionSuccess) {
          onPromotionSuccess();
        } else {
          window.location.reload();
        }
      }, 1500);
      
    } catch (err) {
  console.error('[AdminPromoter] Error updating admin privileges:', err);
      setError('Failed to update admin privileges. Please try again or contact support.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-900/20 border border-green-500 rounded-lg p-6 text-center">
        <div className="text-green-400 mb-2">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-green-400 mb-2">Successfully Promoted to Admin!</h3>
        <p className="text-gray-300">You now have admin privileges. Reloading...</p>
      </div>
    );
  }

  return (
    <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-6">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <svg className="w-12 h-12 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-yellow-400 mb-2">Admin Access Required</h3>
          <p className="text-gray-300 mb-4">
            You need admin privileges to access this page. Click the button below to promote yourself to admin.
          </p>
          {error && (
            <div className="bg-red-900/30 border border-red-500 rounded p-3 mb-4 text-red-400 text-sm">
              {error}
            </div>
          )}
          <button
            onClick={handlePromoteToAdmin}
            disabled={loading}
            className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 text-gray-900 font-semibold px-6 py-3 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Promoting...</span>
              </span>
            ) : (
              'Promote Me to Admin'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPromoter;
