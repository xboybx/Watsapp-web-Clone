import { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import { useConversations, useMessages } from "./hooks/useAPI";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

function App() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Use custom hooks for API integration
  const { 
    conversations, 
    loading: conversationsLoading, 
    error: conversationsError,
    markAsRead 
  } = useConversations(searchTerm);
  
  const { 
    messages, 
    loading: messagesLoading, 
    sendMessage: apiSendMessage,
    updateMessageStatus 
  } = useMessages(selectedConversation?.wa_id);
  // Auto-select first conversation when conversations load
  useEffect(() => {
    if (conversations.length > 0 && !selectedConversation) {
      setSelectedConversation(conversations[0]);
    }
  }, [conversations, selectedConversation]);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light"
    );
  }, [isDarkMode]);

  const handleSendMessage = async (messageText) => {
    if (!selectedConversation || !messageText.trim()) return;

    try {
      // Send message via API
      const sentMessage = await apiSendMessage(messageText, selectedConversation);
      
      if (sentMessage) {
        // Simulate message status updates
        setTimeout(() => {
          updateMessageStatus(sentMessage.id, "delivered");
        }, 1000);

        setTimeout(() => {
          updateMessageStatus(sentMessage.id, "read");
        }, 3000);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      // You could show an error toast here
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleSelectConversation = async (conversation) => {
    setSelectedConversation(conversation);
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }

    // Mark messages as read when opening conversation
    if (conversation.unread_count > 0) {
      await markAsRead(conversation.wa_id);
    }
  };

  const handleBackToSidebar = () => {
    setIsSidebarOpen(true);
    if (window.innerWidth <= 768) {
      setSelectedConversation(null);
    }
  };

  return (
    <div className={`app ${isDarkMode ? "dark" : "light"}`}>
      <div className="theme-toggle">
        <button onClick={toggleTheme} className="theme-button">
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>
      <div className="app-container">
        <div
          className={`sidebar-container ${isSidebarOpen ? "open" : "closed"}`}
        >
          <Sidebar
            conversations={conversations}
            selectedConversation={selectedConversation}
            onSelectConversation={handleSelectConversation}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            isDarkMode={isDarkMode}
            loading={conversationsLoading}
            error={conversationsError}
          />
        </div>
        <ChatArea
          conversation={selectedConversation}
          messages={messages}
          onSendMessage={handleSendMessage}
          onBackToSidebar={handleBackToSidebar}
          isDarkMode={isDarkMode}
          isSidebarOpen={isSidebarOpen}
          loading={messagesLoading}
        />
      </div>
    </div>
  );
}

export default App;
