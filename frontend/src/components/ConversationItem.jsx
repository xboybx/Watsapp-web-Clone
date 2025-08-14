import { formatDistanceToNow } from 'date-fns'
import './ConversationItem.css'

function ConversationItem({ conversation, isSelected, onClick }) {
  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp)
      const now = new Date()
      const diffInHours = (now - date) / (1000 * 60 * 60)
      
      if (diffInHours < 24) {
        return date.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        })
      } else {
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })
      }
    } catch {
      return ''
    }
  }

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatPhoneNumber = (phone) => {
    // Format phone number for display
    if (phone && phone.length > 10) {
      return `+${phone.slice(0, 2)} ${phone.slice(2, 5)} ${phone.slice(5, 8)} ${phone.slice(8)}`
    }
    return phone
  }
  return (
    <div 
      className={`conversation-item ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="avatar">
        <span>{getInitials(conversation.name)}</span>
      </div>
      
      <div className="conversation-content">
        <div className="conversation-header">
          <h3 className="contact-name">{conversation.name}</h3>
          <span className="message-time">
            {formatTime(conversation.last_message_time)}
          </span>
        </div>
        
        <div className="contact-phone">
          {formatPhoneNumber(conversation.phone)}
        </div>
        
        <div className="conversation-footer">
          <p className="last-message">
            {conversation.last_message || 'No messages yet'}
          </p>
          {conversation.unread_count > 0 && (
            <span className="unread-count">
              {conversation.unread_count}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default ConversationItem