import axiosInstance from '../utils/axiosConfig';

// Chat storage utilities
export const chatStorage = {
  // Get chat history from localStorage
  getHistory: (sessionId) => {
    try {
      const history = localStorage.getItem(`chat_history_${sessionId}`);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error loading chat history:', error);
      return [];
    }
  },

  // Save chat history to localStorage
  saveHistory: (sessionId, messages) => {
    try {
      localStorage.setItem(`chat_history_${sessionId}`, JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  },

  // Clear chat history for a session
  clearHistory: (sessionId) => {
    try {
      localStorage.removeItem(`chat_history_${sessionId}`);
    } catch (error) {
      console.error('Error clearing chat history:', error);
    }
  },

  // Get all session IDs
  getAllSessions: () => {
    try {
      const sessions = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('chat_history_')) {
          sessions.push(key.replace('chat_history_', ''));
        }
      }
      return sessions;
    } catch (error) {
      console.error('Error getting sessions:', error);
      return [];
    }
  },

  // Get all chats for a user
  getAllChats: (userId) => {
    try {
      const chats = [];
      const prefix = `chat_${userId}_`;
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          const sessionId = key.replace(prefix, '');
          const messages = JSON.parse(localStorage.getItem(key) || '[]');
          if (messages.length > 0) {
            chats.push({
              sessionId,
              messages,
              lastMessage: messages[messages.length - 1],
              timestamp: messages[messages.length - 1]?.timestamp || new Date().toISOString()
            });
          }
        }
      }
      
      // Sort by timestamp, most recent first
      return chats.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } catch (error) {
      console.error('Error getting all chats:', error);
      return [];
    }
  },

  // Save chat for a specific user
  saveChatForUser: (userId, sessionId, messages) => {
    try {
      const key = `chat_${userId}_${sessionId}`;
      localStorage.setItem(key, JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving chat for user:', error);
    }
  },

  // Get chat for a specific user and session
  getChatForUser: (userId, sessionId) => {
    try {
      const key = `chat_${userId}_${sessionId}`;
      const chat = localStorage.getItem(key);
      return chat ? JSON.parse(chat) : [];
    } catch (error) {
      console.error('Error getting chat for user:', error);
      return [];
    }
  },

  // Clear chat for a specific user and session
  clearChatForUser: (userId, sessionId) => {
    try {
      const key = `chat_${userId}_${sessionId}`;
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error clearing chat for user:', error);
    }
  },

  // Save chat (alias for saveChatForUser with different parameter order)
  saveChat: (sessionId, messages, userId) => {
    try {
      const key = `chat_${userId}_${sessionId}`;
      localStorage.setItem(key, JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving chat:', error);
    }
  },

  // Get chat (alias for getChatForUser with different parameter order)
  getChat: (sessionId, userId) => {
    try {
      const key = `chat_${userId}_${sessionId}`;
      const chat = localStorage.getItem(key);
      return chat ? JSON.parse(chat) : [];
    } catch (error) {
      console.error('Error getting chat:', error);
      return [];
    }
  }
};

// Chat API utilities
export const chatAPI = {
  // Send a message to the chat API
  sendMessage: async (message, sessionId = null) => {
    try {
      const response = await axiosInstance.post('/chat/', {
        message,
        session_id: sessionId
      });
      return response.data;
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw error;
    }
  },

  // Get chat history from server
  getHistory: async (sessionId) => {
    try {
      const response = await axiosInstance.get(`/chat/history/${sessionId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching chat history:', error);
      throw error;
    }
  },

  // Clear chat history on server
  clearHistory: async (sessionId) => {
    try {
      const response = await axiosInstance.delete(`/chat/clear/${sessionId}/`);
      return response.data;
    } catch (error) {
      console.error('Error clearing chat history:', error);
      throw error;
    }
  },

  // Clear chat (alias for clearHistory)
  clearChat: async (sessionId) => {
    try {
      const response = await axiosInstance.delete(`/chat/clear/${sessionId}/`);
      return response.data;
    } catch (error) {
      console.error('Error clearing chat:', error);
      throw error;
    }
  },

  // Get chat summary
  getSummary: async () => {
    try {
      const response = await axiosInstance.get('/chat/summary/');
      return response.data;
    } catch (error) {
      console.error('Error fetching chat summary:', error);
      throw error;
    }
  }
};

// Generate a unique session ID
export const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

export default {
  chatAPI,
  chatStorage,
  generateSessionId
};
