import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';


const UserRoleIndicator = () => {
  const { user, isLoaded } = useUser();
  if (!isLoaded || !user) return null;
  // Example: Clerk user publicMetadata.role === 'admin'
  const isAdmin = user.publicMetadata?.role === 'admin';
  return (
    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
      {isAdmin ? 'Admin' : 'Student'}
    </div>
  );
};

export default UserRoleIndicator;
