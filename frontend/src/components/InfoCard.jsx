import React from 'react';

export default function InfoCard({ icon, title, description }) {
  return (
    <div
      className="p-6 rounded-xl shadow-md bg-white/40 dark:bg-gray-800/40 text-gray-900 dark:text-gray-100 transition-colors duration-300 border border-white/30 dark:border-gray-700/30"
      style={{ transform: "none" }}
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-base opacity-80">{description}</p>
    </div>
  );
}
