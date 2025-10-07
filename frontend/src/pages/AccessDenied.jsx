import React from 'react';

const AccessDenied = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
    <div className="bg-red-800 text-white px-6 py-4 rounded shadow-md">
      <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
      <p className="mb-4">You do not have permission to view this page.</p>
      <a href="/" className="text-blue-400 underline">Go to Home</a>
    </div>
  </div>
);

export default AccessDenied;
