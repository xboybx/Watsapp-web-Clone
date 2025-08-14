import {
  FaPhone,
  FaVideo,
  FaSearch,
  FaEllipsisV,
  FaArrowLeft,
} from "react-icons/fa";
import { useState } from "react";
import "./ChatHeader.css";

function ChatHeader({ conversation, onBackToSidebar, isDarkMode }) {
  const [showMenu, setShowMenu] = useState(false);

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatPhoneNumber = (phone) => {
    if (phone && phone.length > 10) {
      return `+${phone.slice(0, 2)} ${phone.slice(2, 5)} ${phone.slice(
        5,
        8
      )} ${phone.slice(8)}`;
    }
    return phone;
  };
  return (
    <div className="chat-header">
      <button className="back-button" onClick={onBackToSidebar}>
        <FaArrowLeft />
      </button>
      <div className="chat-header-info">
        <div className="chat-avatar">
          <div className="avatar-gradient">
            <span>{getInitials(conversation.name)}</span>
          </div>
          <div className="online-indicator"></div>
        </div>
        <div className="chat-details">
          <h3 className="chat-name">{conversation.name}</h3>
          <p className="chat-phone">{formatPhoneNumber(conversation.phone)}</p>
          <p className="chat-status">
            <span className="status-dot"></span>
            Online • Last seen recently
          </p>
        </div>
      </div>

      <div className="chat-header-actions">
        <button className="header-action-button" title="Search">
          <FaSearch />
        </button>
        <button className="header-action-button" title="Voice call">
          <FaPhone />
        </button>
        <button className="header-action-button" title="Video call">
          <FaVideo />
        </button>
        <div style={{ position: "relative" }}>
          <button
            className="header-action-button"
            title="More options"
            onClick={() => setShowMenu(!showMenu)}
          >
            <FaEllipsisV />
          </button>

          {showMenu && (
            <div
              style={{
                position: "absolute",
                top: "40px",
                right: "0",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-primary)",
                borderRadius: "12px",
                padding: "8px",
                boxShadow: "0 4px 20px var(--shadow-primary)",
                zIndex: 1000,
                minWidth: "150px",
              }}
            >
              <button
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "none",
                  background: "transparent",
                  color: "var(--icon-color)",
                  cursor: "pointer",
                  borderRadius: "0",
                  textAlign: "left",
                  fontSize: "14px",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.background = "transparent")
                }
                onMouseLeave={(e) =>
                  (e.target.style.background = "transparent")
                }
              >
                Contact info
              </button>
              <button
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "none",
                  background: "transparent",
                  color: "var(--icon-color)",
                  cursor: "pointer",
                  borderRadius: "0",
                  textAlign: "left",
                  fontSize: "14px",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.background = "transparent")
                }
                onMouseLeave={(e) =>
                  (e.target.style.background = "transparent")
                }
              >
                Select messages
              </button>
              <button
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "none",
                  background: "transparent",
                  color: "var(--icon-color)",
                  cursor: "pointer",
                  borderRadius: "0",
                  textAlign: "left",
                  fontSize: "14px",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.background = "transparent")
                }
                onMouseLeave={(e) =>
                  (e.target.style.background = "transparent")
                }
              >
                Mute notifications
              </button>
              <button
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "none",
                  background: "transparent",
                  color: "#ff6b6b",
                  cursor: "pointer",
                  borderRadius: "0",
                  textAlign: "left",
                  fontSize: "14px",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.background = "transparent")
                }
                onMouseLeave={(e) =>
                  (e.target.style.background = "transparent")
                }
              >
                Delete chat
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatHeader;
