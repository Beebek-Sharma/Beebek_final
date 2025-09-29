
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
  
  // Handle responsive sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      // Only close the sidebar when on mobile
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
      <div className="flex h-screen bg-gray-50 dark:bg-github-dark">
        {/* Sidebar - Toggleable on all screen sizes */}
        <div className={`fixed md:relative inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:w-64 md:flex-shrink-0`}>
          <div className="h-full w-64">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
          </div>
        </div>
        
        {/* Overlay - Only shown when sidebar is open */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 md:hidden"
            aria-hidden="true"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        {/* Main content area - adjusts based on sidebar state */}
        <div className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ${
          isSidebarOpen ? 'md:ml-64' : 'md:ml-0'
        }`}>
          <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          <main className="flex-1 overflow-y-auto p-4 pt-16 md:p-6">
            <Routes />
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
