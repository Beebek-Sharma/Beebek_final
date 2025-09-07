import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const UserRoleIndicator = () => {
  const { user, isAdmin } = useAuth();
  
  if (!user) return null;
  
  return (
    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
      {isAdmin ? 'Admin' : 'Student'}
    </div>
  );
};

export default UserRoleIndicator;
