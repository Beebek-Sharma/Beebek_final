import React from 'react';
import LiquidEther from './LiquidEther';

export default function PageLayout({ children }) {
  return (
    <div className="fixed inset-0 w-full h-screen overflow-hidden bg-white dark:bg-gray-950">
      {/* Liquid Ether Background - Full screen with mouse events */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-auto">
        <LiquidEther
          colors={['#5227FF', '#FF9FFC', '#B19EEF']}
          mouseForce={40}
          cursorSize={150}
          autoDemo={true}
          autoSpeed={0.8}
          autoIntensity={2.5}
          resolution={1}
          isBounce={false}
        />
      </div>

      {/* Content wrapper - scrollable above background */}
      <div className="absolute inset-0 w-full h-full overflow-y-auto overflow-x-hidden z-20" style={{ pointerEvents: 'auto' }}>
        <div className="w-full min-h-full" style={{ pointerEvents: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
