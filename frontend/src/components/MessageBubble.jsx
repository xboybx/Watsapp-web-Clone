import { FaCheck, FaCheckDouble } from "react-icons/fa";
import "./MessageBubble.css";

function MessageBubble({ message }) {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  const getStatusIcon = (status) => {
    switch (status) {
      case "sent":
        return <FaCheck className="status-icon sent" strokeWidth="2.5" />;
      case "delivered":
        return (
          <div className="status-double">
            <FaCheck className="status-icon delivered" strokeWidth="2.5" />
            <FaCheck className="status-icon delivered" strokeWidth="2.5" />
          </div>
        );
      case "read":
        return (
          <div className="status-double">
            <FaCheck className="status-icon read" strokeWidth="2.5" />
            <FaCheck className="status-icon read" strokeWidth="2.5" />
          </div>
        );
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "sent":
        return "Sent";
      case "delivered":
        return "Delivered";
      case "read":
        return "Read";
      default:
        return "Pending";
    }
  };
  return (
    <div
      className={`message-bubble ${message.from_me ? "outgoing" : "incoming"}`}
    >
      <div className="message-content">
        <p className="message-text">{message.text}</p>
        <div className="message-meta">
          <span
            className="message-time"
            title={`${formatDate(message.timestamp)} ${formatTime(
              message.timestamp
            )}`}
          >
            {formatTime(message.timestamp)}
          </span>
          {message.from_me && (
            <span
              className="message-status"
              title={getStatusText(message.status)}
            >
              {getStatusIcon(message.status)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;
