import React from 'react';
import { useAuth } from '../context/AuthContext';


const UserRoleIndicator = () => {
  const { user } = useAuth();
  if (!user) return null;
  
  const isAdmin = user.role === 'superuser_admin';
  return (
    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
      {isAdmin ? 'Admin' : 'Student'}
    </div>
  );
};

export default UserRoleIndicator;
