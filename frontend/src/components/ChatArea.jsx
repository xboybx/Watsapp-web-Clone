import { useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { FaComments } from "react-icons/fa";
import "./ChatArea.css";

function ChatArea({
  conversation,
  messages,
  onSendMessage,
  onBackToSidebar,
  isDarkMode,
  loading,
}) {
  const [messageInput, setMessageInput] = useState("");

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      onSendMessage(messageInput);
      setMessageInput("");
    }
  };

  const renderWelcomeScreen = () => (
    <div className="welcome-screen">
      <div className="welcome-content">
        <div className="welcome-icon">
          <div className="welcome-logo">
            <FaComments />
          </div>
        </div>
        <h1>WhatsApp Web</h1>
        <p>Select a conversation from the sidebar to start chatting.</p>
      </div>
    </div>
  );

  return (
    <div className="chat-area">
      {conversation ? (
        <>
          <ChatHeader
            conversation={conversation}
            onBackToSidebar={onBackToSidebar}
            isDarkMode={isDarkMode}
          />
          <MessageList messages={messages} loading={loading} />
          <MessageInput
            value={messageInput}
            onChange={setMessageInput}
            onSend={handleSendMessage}
            placeholder={`Message ${conversation.name}`}
            isDarkMode={isDarkMode}
          />
        </>
      ) : (
        renderWelcomeScreen()
      )}
    </div>
  );
}

export default ChatArea;
