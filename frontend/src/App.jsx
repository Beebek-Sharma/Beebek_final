
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
// import { BrowserRouter } from 'react-router-dom';
import Routes from './Routes';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import RouteChangeListener from './components/RouteChangeListener';
import ChatWidget from './components/ChatWidget';
import PageLayout from './components/PageLayout';
// ...existing code...

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Track last visited page except login/register/password reset pages
  useEffect(() => {
    const publicPaths = ['/login', '/register', '/forgot-password', '/reset-password'];
    if (!publicPaths.some(p => location.pathname.startsWith(p))) {
      localStorage.setItem('last_visited_page', location.pathname + location.search);
    }
  }, [location.pathname, location.search]);
  
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

    // Ensure CSRF cookie is set on app load (AuthContext handles auth verification)
    useEffect(() => {
      import('./utils/csrf').then(({ fetchCSRFToken }) => {
        fetchCSRFToken()
          .then(() => {
            console.log('[App] CSRF token fetched successfully');
          })
          .catch(error => {
            console.error('[App] Error fetching CSRF token:', error);
          });
      });
    }, []);
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/forgot-password';
  
  if (isAuthPage) {
    return (
      <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
        <Routes />
      </div>
    );
  }
  
  return (
    <PageLayout>
      <div className="flex flex-col min-h-screen bg-transparent">
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="flex flex-1 overflow-hidden">
          <div 
            className={`fixed top-0 left-0 w-64 h-full z-50 transform transition-transform duration-300 ease-in-out ${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } pt-16`}
          >
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
          </div>
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 top-16 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
              aria-hidden="true"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
          <div className="flex flex-col flex-1 bg-transparent">
            <RouteChangeListener />
            <main className="flex-1 overflow-y-auto no-scrollbar p-4 pt-20 md:p-8 md:pt-20 bg-transparent">
              <Routes />
            </main>
            {location.pathname !== '/login' && location.pathname !== '/register' && <Footer />}
          </div>
        </div>
        
        {/* AI Chat Widget */}
        <ChatWidget />
      </div>
    </PageLayout>
  );
}

export default App;
