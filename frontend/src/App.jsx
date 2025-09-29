
import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from './Routes';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ClerkAuthListener from './components/ClerkAuthListener';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/clerk-react';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);
  
  // Close sidebar on resize and when clicking outside
  useEffect(() => {
    // Close sidebar on window resize
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };
    
    // Initial check
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <BrowserRouter>
      <ClerkAuthListener />
      <div className="flex flex-col h-screen bg-gray-50 dark:bg-github-dark">
        {/* Fixed Header - Always at the top, doesn't move with sidebar */}
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        {/* Content Area - Contains both the sidebar and main content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Overlay style like Medium.com */}
          <div 
            className={`fixed top-0 left-0 w-64 h-full z-40 transform transition-transform duration-300 ease-in-out ${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } pt-16`} // pt-16 to position below header
          >
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
          </div>
          
          {/* Overlay - Only shown when sidebar is open, covers the whole screen except header */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 top-16 bg-black bg-opacity-50 z-30 transition-opacity duration-300"
              aria-hidden="true"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
          
          {/* Main content area - Doesn't shift when sidebar opens/closes - Medium-style */}
          <main className="flex-1 overflow-y-auto p-4 pt-20 md:p-8 md:pt-20">
            <Routes />
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
