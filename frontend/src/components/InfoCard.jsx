import React from 'react';

export default function InfoCard({ icon, title, description }) {
  return (
    <div
      className="p-6 rounded-xl shadow-md bg-github-lightAccent dark:bg-github-darkAccent text-github-lightText dark:text-github-darkText transition-colors duration-300"
      style={{ transform: "none" }}
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-base opacity-80">{description}</p>
    </div>
  );
}
