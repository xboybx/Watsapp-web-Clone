import { FaSearch, FaComments } from "react-icons/fa";
import ConversationItem from "./ConversationItem";
import "./Sidebar.css";

function Sidebar({
  conversations,
  selectedConversation,
  onSelectConversation,
  searchTerm,
  onSearchChange,
  isDarkMode,
  loading,
  error,
}) {
  // Filter conversations on frontend for better UX
  const filteredConversations = conversations.filter(
    (conv) =>
      conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.wa_id.includes(searchTerm) ||
      conv.phone.includes(searchTerm)
  );

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-header-content">
          <div className="profile-section">
            <div className="profile-avatar">
              <div className="avatar-gradient">
                <FaComments />
              </div>
            </div>
            <div className="profile-info">
              <h2>Messages</h2>
              <span className="status-indicator">Online</span>
            </div>
          </div>
        </div>
      </div>

      <div className="search-container">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search or start new chat"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button onClick={() => onSearchChange("")} className="clear-search">
              ×
            </button>
          )}
        </div>
      </div>

      <div className="conversations-list">
        {loading ? (
          <div className="no-conversations">
            <div className="empty-state">
              <FaComments className="empty-icon" />
              <p>Loading conversations...</p>
            </div>
          </div>
        ) : error ? (
          <div className="no-conversations">
            <div className="empty-state">
              <FaComments className="empty-icon" />
              <p>Error loading conversations</p>
              <span>{error}</span>
            </div>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="no-conversations">
            <div className="empty-state">
              <FaComments className="empty-icon" />
              <p>No conversations found</p>
              <span>Start a new conversation</span>
            </div>
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <ConversationItem
              key={conversation.wa_id}
              conversation={conversation}
              isSelected={selectedConversation?.wa_id === conversation.wa_id}
              onClick={() => onSelectConversation(conversation)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Sidebar;
