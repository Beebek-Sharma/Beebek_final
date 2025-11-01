import { useState, useEffect, useRef } from 'react';
import { chatAPI, chatStorage } from '../api/chat';
import { 
  ChatBubbleLeftRightIcon,
  XMarkIcon, 
  PaperAirplaneIcon, 
  ArrowPathIcon,
  TrashIcon 
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ChatWidget component - A floating chat widget for AI-powered conversations
 * 
 * @param {Object} props - Component properties
 * @returns {JSX.Element} - The chat widget component
 */
const ChatWidget = () => {
  // State for the chat
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [error, setError] = useState(null);
  // Get current user
  const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
  const userId = user?.id || user?.username || 'anonymous';
  
  // Ref for message container to scroll to bottom
  const messagesEndRef = useRef(null);
  const chatWidgetRef = useRef(null);
  
  // Effect to initialize session or load from localStorage
  useEffect(() => {
    // Try to load existing session from localStorage for this user
    const storedSessions = chatStorage.getAllChats(userId);
    if (storedSessions.length > 0) {
      const latestSession = storedSessions[0];
      setSessionId(latestSession.sessionId);
      setMessages(latestSession.messages);
    } else {
      // Generate a new session ID
      const newSessionId = crypto.randomUUID();
      setSessionId(newSessionId);
      // Initialize with a welcome message
      const welcomeMessage = {
        role: 'assistant',
        content: 'Hi there! How can I help you today?',
        timestamp: new Date().toISOString()
      };
      setMessages([welcomeMessage]);
      chatStorage.saveChat(newSessionId, [welcomeMessage], userId);
    }
  }, [userId]);
  
  // Effect to scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);
  
  // Effect to save messages to localStorage when they change
  useEffect(() => {
    if (sessionId && messages.length > 0) {
      chatStorage.saveChat(sessionId, messages, userId);
    }
  }, [messages, sessionId, userId]);

  // Close chat widget when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatWidgetRef.current && !chatWidgetRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  /**
   * Scroll to the bottom of the message container
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  /**
   * Handle form submission to send a message
   * 
   * @param {Event} e - The form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message to state
    const userMessage = {
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toISOString()
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);
    
    try {
      // Send message to API
      const response = await chatAPI.sendMessage(userMessage.content, sessionId);
      
      // Update session ID if this was a new session
      if (response.session_id !== sessionId) {
        setSessionId(response.session_id);
      }
      
      // Add assistant response to state
      const assistantMessage = {
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toISOString(),
        developmentMode: response.development_mode
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
      
      // Add error message to chat
      const errorMessage = {
        role: 'system',
        content: 'Sorry, there was an error processing your request. Please try again.',
        error: true,
        timestamp: new Date().toISOString()
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Handle retry when an error occurs
   */
  const handleRetry = () => {
    // Find the last user message
    const lastUserMessage = [...messages].reverse().find(msg => msg.role === 'user');
    
    if (lastUserMessage) {
      setInputValue(lastUserMessage.content);
    }
    
    setError(null);
  };
  
  /**
   * Clear the conversation history
   */
  const handleClearChat = async () => {
    try {
      if (sessionId) {
        // Clear on the backend
        await chatAPI.clearChat(sessionId);
      }
      
      // Generate a new session ID
      const newSessionId = crypto.randomUUID();
      setSessionId(newSessionId);
      
      // Reset to welcome message
      const welcomeMessage = {
        role: 'assistant',
        content: 'Chat history cleared. How can I help you?',
        timestamp: new Date().toISOString()
      };
      
      setMessages([welcomeMessage]);
      chatStorage.saveChat(newSessionId, [welcomeMessage]);
    } catch (err) {
      console.error('Error clearing chat:', err);
      setError('Failed to clear chat history. Please try again.');
    }
  };
  
  /**
   * Render a chat message bubble
   * 
   * @param {Object} message - The message object
   * @param {number} index - The message index
   * @returns {JSX.Element} - The message bubble
   */
  const renderMessage = (message, index) => {
    // Determine message type and styling
    const isUser = message.role === 'user';
    const isSystem = message.role === 'system';
    const isDevelopmentMode = message.developmentMode;
    
    const containerClasses = isUser 
      ? 'flex justify-end' 
      : 'flex justify-start';
      
    const bubbleClasses = isUser
      ? 'bg-teal-600 text-white rounded-tl-2xl rounded-tr-sm rounded-bl-2xl rounded-br-2xl'
      : isSystem
        ? 'bg-gray-300 text-gray-800 rounded-tl-2xl rounded-tr-2xl rounded-bl-sm rounded-br-2xl'
        : isDevelopmentMode
          ? 'bg-amber-100 text-gray-800 border border-amber-300 rounded-tl-sm rounded-tr-2xl rounded-bl-2xl rounded-br-2xl'
          : 'bg-gray-100 dark:bg-github-darkSecondary/50 text-gray-800 rounded-tl-sm rounded-tr-2xl rounded-bl-2xl rounded-br-2xl';
    
    return (
      <div key={index} className={`${containerClasses} mb-4`}>
        <div className={`${bubbleClasses} py-2 px-4 max-w-[80%]`}>
          {isDevelopmentMode && (
            <div className="text-xs text-amber-600 font-medium mb-1">
              Development Mode
            </div>
          )}
          <div className="text-sm dark:text-gray-100">
            {message.content}
            
            {message.error && (
              <button 
                onClick={handleRetry}
                className="text-red-500 underline ml-2 text-xs"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div ref={chatWidgetRef}>
      {/* Floating chat button */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-teal-600 hover:bg-teal-700 text-white rounded-full p-3 shadow-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-teal-300"
          aria-label={isOpen ? 'Close chat' : 'Open chat'}
        >
          {isOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <ChatBubbleLeftRightIcon className="h-6 w-6" />
          )}
        </button>
      </div>
      
      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 z-40 w-80 sm:w-96 h-96 rounded-xl shadow-lg flex flex-col border border-github-lightBorder dark:border-github-darkBorder overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, rgba(30,41,59,0.7) 0%, rgba(255,255,255,0.3) 100%)',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
              border: '1px solid rgba(200,200,200,0.15)'
            }}
          >
            {/* Chat header */}
            <div className="p-4 bg-teal-600 text-white  bg-white/10 dark:bg-github-darkSecondary/10 rounded-t-lg flex justify-between items-center">
              <div>
                <h3 className="font-medium">Chat with us</h3>
                <p className="text-xs opacity-80">Typically replies in a few minutes</p>
              </div>
              <button
                onClick={handleClearChat}
                className="text-white hover:bg-teal-700 rounded-full p-1 focus:outline-none"
                aria-label="Clear chat"
                title="Clear chat history"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
            
            {/* Messages area */}
            <div className="flex-1 overflow-y-auto bg-white/50 dark:bg-github-darkSecondary/50 p-4">
              {messages.map((message, index) => renderMessage(message, index))}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-gray-100 dark:bg-github-darkSecondary/50 rounded-tl-sm rounded-tr-2xl rounded-bl-2xl rounded-br-2xl py-2 px-4">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Auto-scroll anchor */}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input area */}
            <form onSubmit={handleSubmit} className="p-2 border-t border-gray-200 flex">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-teal-300 disabled:opacity-50"
                aria-label="Send message"
              >
                {isLoading ? (
                  <ArrowPathIcon className="h-5 w-5 animate-spin" />
                ) : (
                  <PaperAirplaneIcon className="h-5 w-5" />
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatWidget;