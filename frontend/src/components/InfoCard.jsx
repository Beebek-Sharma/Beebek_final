import React from 'react';

export default function InfoCard({ icon, title, description }) {
  return (
    <div className="panel p-8 rounded-xl shadow-lg" style={{ backgroundColor: '#23242B', color: '#E0E0E0' }}>
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-base opacity-80">{description}</p>
    </div>
  );
}
