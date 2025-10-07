import React from 'react';

const CompareButton = ({ course, onCompare }) => {
  const handleClick = () => {
    if (onCompare) {
      onCompare(course);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
    >
      Compare
    </button>
  );
};

export default CompareButton;