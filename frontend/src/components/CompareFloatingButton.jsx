import React from 'react';

const CompareFloatingButton = ({ compareList = [], onCompare }) => {
  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={onCompare}
        className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
      >
        Compare ({compareList.length})
      </button>
    </div>
  );
};

export default CompareFloatingButton;