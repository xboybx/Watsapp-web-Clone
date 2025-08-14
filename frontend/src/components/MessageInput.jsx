import { useState, useEffect, useRef } from "react";
import {
  FaSmile,
  FaPaperclip,
  FaRegImage,
  FaRegFileAlt,
  FaPaperPlane,
  FaMicrophone,
} from "react-icons/fa";
import "./MessageInput.css";

function MessageInput({ value, onChange, onSend, placeholder, isDarkMode }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const attachMenuRef = useRef(null);
  const emojiPickerRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        attachMenuRef.current &&
        !attachMenuRef.current.contains(event.target)
      ) {
        setShowAttachMenu(false);
      }
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleInputChange = (e) => {
    onChange(e.target.value);
    setIsTyping(e.target.value.length > 0);
  };

  const handleSend = () => {
    onSend();
    setIsTyping(false);
  };

  const handleAttachClick = () => {
    setShowAttachMenu(!showAttachMenu);
  };

  const handleFileUpload = (type) => {
    // Create file input element
    const input = document.createElement("input");
    input.type = "file";

    if (type === "image") {
      input.accept = "image/*";
    } else if (type === "document") {
      input.accept = ".pdf,.doc,.docx,.txt";
    }

    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // For demo purposes, just show the file name as a message
        onChange(`📎 ${file.name}`);
        setShowAttachMenu(false);
      }
    };

    input.click();
  };

  const handleEmojiClick = (emoji) => {
    onChange(value + emoji);
    setShowEmojiPicker(false);
  };

  const commonEmojis = [
    "😀",
    "😂",
    "😍",
    "🥰",
    "😊",
    "😎",
    "🤔",
    "😢",
    "😡",
    "👍",
    "👎",
    "❤️",
    "🔥",
    "💯",
    "🎉",
    "👏",
  ];

  return (
    <div className="message-input-container">
      <div className="message-input-wrapper">
        <div style={{ position: "relative" }} ref={emojiPickerRef}>
          <button
            className="input-action-button"
            title="Emoji"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <FaSmile size={24} />
          </button>

          {showEmojiPicker && (
            <div
              style={{
                position: "absolute",
                bottom: "50px",
                left: "0",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-primary)",
                borderRadius: "12px",
                padding: "12px",
                boxShadow: "0 4px 20px var(--shadow-primary)",
                zIndex: 1000,
                width: "500px",
                display: "grid",
                gridTemplateColumns: "repeat(8, 1fr)",
                gap: "4px",
              }}
            >
              {commonEmojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => handleEmojiClick(emoji)}
                  style={{
                    width: "36px",
                    height: "36px",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    borderRadius: "8px",
                    fontSize: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.background = "var(--bg-tertiary)")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.background = "transparent")
                  }
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ position: "relative" }} ref={attachMenuRef}>
          <button
            className="input-action-button"
            title="Attach file"
            onClick={handleAttachClick}
          >
            <FaPaperclip size={24} />
          </button>

          {showAttachMenu && (
            <div
              style={{
                position: "absolute",
                bottom: "50px",
                left: "0",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-primary)",
                borderRadius: "12px",
                padding: "8px",
                boxShadow: "0 4px 20px var(--shadow-primary)",
                zIndex: 1000,
                minWidth: "120px",
              }}
            >
              <button
                onClick={() => handleFileUpload("image")}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "none",
                  background: "transparent",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.background = "var(--bg-tertiary)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.background = "transparent")
                }
              >
                📷 Photos
              </button>
              <button
                onClick={() => handleFileUpload("document")}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "none",
                  background: "transparent",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.background = "var(--bg-tertiary)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.background = "transparent")
                }
              >
                📄 Documents
              </button>
            </div>
          )}
        </div>

        <div className="text-input-container">
          <textarea
            value={value}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="message-textarea"
            rows={1}
            maxLength={4000}
          />
        </div>

        {isTyping ? (
          <button
            className="send-button"
            onClick={handleSend}
            disabled={!value.trim()}
            title="Send message"
          >
            <FaPaperPlane size={24} />
          </button>
        ) : (
          <button
            className={`voice-button ${isRecording ? "recording" : ""}`}
            onClick={() => setIsRecording(!isRecording)}
            title={isRecording ? "Stop recording" : "Voice message"}
          >
            <FaMicrophone size={24} />
          </button>
        )}
      </div>
    </div>
  );
}

export default MessageInput;
