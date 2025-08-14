import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'
import './MessageList.css'

function MessageList({ messages, loading }) {
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const formatDateSeparator = (date) => {
    const messageDate = new Date(date)
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return messageDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  }

  if (loading) {
    return (
      <div className="message-list">
        <div className="empty-chat">
          <div className="empty-chat-icon">⏳</div>
          <p>Loading messages...</p>
        </div>
      </div>
    )
  }

  const groupMessagesByDate = (messages) => {
    const groups = []
    let currentGroup = null

    // Sort messages by timestamp first
    const sortedMessages = [...messages].sort((a, b) => 
      new Date(a.timestamp) - new Date(b.timestamp)
    )
    sortedMessages.forEach((message) => {
      const messageDate = new Date(message.timestamp).toDateString()
      
      if (!currentGroup || currentGroup.date !== messageDate) {
        currentGroup = {
          date: messageDate,
          messages: [message]
        }
        groups.push(currentGroup)
      } else {
        currentGroup.messages.push(message)
      }
    })

    return groups
  }

  if (messages.length === 0) {
    return (
      <div className="message-list">
        <div className="empty-chat">
          <div className="empty-chat-icon">💬</div>
          <p>No messages yet. Start a conversation!</p>
          <span>Send a message to begin chatting</span>
        </div>
      </div>
    )
  }

  const messageGroups = groupMessagesByDate(messages)

  return (
    <div className="message-list">
      <div className="messages-container">
        {messageGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            <div className="date-separator">
              <span>{formatDateSeparator(group.date)}</span>
            </div>
            {group.messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}

export default MessageList