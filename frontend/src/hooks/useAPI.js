import { useState, useEffect, useCallback } from 'react';
import { conversationAPI, messageAPI } from '../services/api';

// Custom hook for managing conversations
export const useConversations = (searchTerm = '') => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = searchTerm ? { search: searchTerm } : {};
      const response = await conversationAPI.getAll(params);
      
      setConversations(response.data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const markAsRead = useCallback(async (wa_id) => {
    try {
      await conversationAPI.markAsRead(wa_id);
      
      // Update local state
      setConversations(prev => 
        prev.map(conv => 
          conv.wa_id === wa_id 
            ? { ...conv, unread_count: 0 }
            : conv
        )
      );
    } catch (err) {
      console.error('Error marking conversation as read:', err);
    }
  }, []);

  return {
    conversations,
    loading,
    error,
    refetch: fetchConversations,
    markAsRead
  };
};

// Custom hook for managing messages
export const useMessages = (wa_id) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMessages = useCallback(async () => {
    if (!wa_id) {
      setMessages([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await messageAPI.getByConversation(wa_id);
      setMessages(response.data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  }, [wa_id]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const sendMessage = useCallback(async (messageText, conversationData) => {
    if (!messageText.trim() || !conversationData) return null;

    try {
      const messageData = {
        wa_id: conversationData.wa_id,
        text: messageText,
        contact_name: conversationData.name,
        contact_phone: conversationData.phone
      };

      const response = await messageAPI.send(messageData);
      
      // Add message to local state immediately
      if (response.data) {
        setMessages(prev => [...prev, response.data]);
      }

      return response.data;
    } catch (err) {
      console.error('Error sending message:', err);
      throw err;
    }
  }, []);

  const updateMessageStatus = useCallback(async (messageId, status) => {
    try {
      await messageAPI.updateStatus({
        message_id: messageId,
        status
      });

      // Update local state
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId || msg.meta_msg_id === messageId
            ? { 
                ...msg, 
                status, 
                status_timestamp: new Date().toISOString() 
              }
            : msg
        )
      );
    } catch (err) {
      console.error('Error updating message status:', err);
    }
  }, []);

  return {
    messages,
    loading,
    error,
    refetch: fetchMessages,
    sendMessage,
    updateMessageStatus
  };
};

// Custom hook for API health check
export const useHealthCheck = () => {
  const [isHealthy, setIsHealthy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/health');
        setIsHealthy(response.ok);
      } catch (error) {
        setIsHealthy(false);
        console.error('Health check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
    
    // Check health every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return { isHealthy, loading };
};