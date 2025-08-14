import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);

    // Handle different error types
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access');
    } else if (error.response?.status === 500) {
      // Handle server errors
      console.error('Server error occurred');
    }

    return Promise.reject(error);
  }
);

// Conversation API methods
export const conversationAPI = {
  // Get all conversations
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/conversations', { params });
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch conversations: ${error.message}`);
    }
  },

  // Get conversation by wa_id
  getById: async (wa_id) => {
    try {
      const response = await api.get(`/conversations/${wa_id}`);
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch conversation: ${error.message}`);
    }
  },

  // Mark conversation as read
  markAsRead: async (wa_id) => {
    try {
      const response = await api.patch(`/conversations/${wa_id}/read`);
      return response;
    } catch (error) {
      throw new Error(`Failed to mark conversation as read: ${error.message}`);
    }
  },

  // Get conversation statistics
  getStats: async (wa_id) => {
    try {
      const response = await api.get(`/conversations/${wa_id}/stats`);
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch conversation stats: ${error.message}`);
    }
  }
};

// Message API methods
export const messageAPI = {
  // Get messages for a conversation
  getByConversation: async (wa_id, params = {}) => {
    try {
      const response = await api.get(`/messages/conversation/${wa_id}`, { params });
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch messages: ${error.message}`);
    }
  },

  // Send a new message
  send: async (messageData) => {
    try {
      const response = await api.post('/messages/send', messageData);
      return response;
    } catch (error) {
      throw new Error(`Failed to send message: ${error.message}`);
    }
  },

  // Process webhook message
  processWebhook: async (webhookData) => {
    try {
      const response = await api.post('/messages/webhook', webhookData);
      return response;
    } catch (error) {
      throw new Error(`Failed to process webhook: ${error.message}`);
    }
  },

  // Update message status
  updateStatus: async (statusData) => {
    try {
      const response = await api.patch('/messages/status', statusData);
      return response;
    } catch (error) {
      throw new Error(`Failed to update message status: ${error.message}`);
    }
  }
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response;
  } catch (error) {
    throw new Error(`Health check failed: ${error.message}`);
  }
};

export default api;