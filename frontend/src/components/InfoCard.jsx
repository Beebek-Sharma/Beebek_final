import React from 'react';

const InfoCard = ({ icon, title, description }) => (
  <div className="bg-github-lightAccent dark:bg-github-darkAccent rounded-lg shadow p-6 flex flex-col items-center transition-colors duration-300">
    <div className="mb-4">{icon}</div>
    <h3 className="text-lg font-semibold text-github-lightText dark:text-github-darkText mb-2">{title}</h3>
    <p className="text-github-lightTextSecondary dark:text-github-darkTextSecondary text-center">{description}</p>
  </div>
);

export default InfoCard;
