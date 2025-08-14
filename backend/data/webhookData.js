// Parse webhook data to extract conversations and messages
import conv1msg1 from './conversation_1_message_1.json'
import conv1msg2 from './conversation_1_message_2.json'
import conv1status1 from './conversation_1_status_1.json'
import conv1status2 from './conversation_1_status_2.json'
import conv2msg1 from './conversation_2_message_1.json'
import conv2msg2 from './conversation_2_message_2.json'
import conv2status1 from './conversation_2_status_1.json'
import conv2status2 from './conversation_2_status_2.json'

// Helper function to extract message data from webhook
const extractMessageFromWebhook = (webhook) => {
  const entry = webhook.metaData.entry[0]
  const change = entry.changes[0]
  const value = change.value
  
  if (value.messages) {
    const message = value.messages[0]
    const contact = value.contacts?.[0]
    const businessPhone = value.metadata?.display_phone_number
    
    return {
      id: message.id,
      meta_msg_id: message.id, // Use same ID for meta_msg_id
      text: message.text.body,
      timestamp: new Date(parseInt(message.timestamp) * 1000).toISOString(),
      type: 'text',
      from_me: message.from === businessPhone,
      wa_id: message.from === businessPhone ? businessPhone : message.from,
      contact_name: contact?.profile?.name || 'Unknown',
      contact_phone: message.from,
      status: 'sent' // Initial status
    }
  }
  return null
}

// Helper function to extract status from webhook
const extractStatusFromWebhook = (webhook) => {
  const entry = webhook.metaData.entry[0]
  const change = entry.changes[0]
  const value = change.value
  
  if (value.statuses) {
    const status = value.statuses[0]
    return {
      message_id: status.id,
      meta_msg_id: status.meta_msg_id || status.id,
      status: status.status,
      timestamp: new Date(parseInt(status.timestamp) * 1000).toISOString(),
      recipient_id: status.recipient_id
    }
  }
  return null
}

// Extract all messages
const allMessages = [
  extractMessageFromWebhook(conv1msg1),
  extractMessageFromWebhook(conv1msg2),
  extractMessageFromWebhook(conv2msg1),
  extractMessageFromWebhook(conv2msg2)
].filter(Boolean)

// Extract all statuses
const allStatuses = [
  extractStatusFromWebhook(conv1status1),
  extractStatusFromWebhook(conv1status2),
  extractStatusFromWebhook(conv2status1),
  extractStatusFromWebhook(conv2status2)
].filter(Boolean)

// Apply status updates to messages using id or meta_msg_id field
const messagesWithStatus = allMessages.map(message => {
  const statusUpdate = allStatuses.find(status => 
    status.message_id === message.id || 
    status.meta_msg_id === message.meta_msg_id ||
    status.message_id === message.meta_msg_id
  )
  return {
    ...message,
    status: statusUpdate?.status || message.status,
    status_timestamp: statusUpdate?.timestamp || message.timestamp
  }
})

// Group messages by conversation (wa_id) - group by contact, not business number
const messagesByConversation = messagesWithStatus.reduce((acc, message) => {
  // Use the contact's wa_id as the key, not the business number
  const conversationKey = message.from_me ? message.wa_id : message.contact_phone
  if (!acc[conversationKey]) {
    acc[conversationKey] = []
  }
  acc[conversationKey].push(message)
  return acc
}, {})

// Create conversations from messages - grouped by user (wa_id)
export const webhookConversations = Object.keys(messagesByConversation).map(wa_id => {
  const messages = messagesByConversation[wa_id].sort((a, b) => 
    new Date(a.timestamp) - new Date(b.timestamp)
  )
  const lastMessage = messages[messages.length - 1]
  const firstMessage = messages[0]
  
  // Extract phone number for display
  const phoneNumber = wa_id.replace(/^\+/, '')
  
  return {
    wa_id,
    name: firstMessage.contact_name,
    phone: phoneNumber,
    last_message: lastMessage.text,
    last_message_time: lastMessage.timestamp,
    unread_count: messages.filter(m => !m.from_me && m.status !== 'read').length,
    total_messages: messages.length
  }
})

export const webhookMessages = messagesByConversation

// Function to update message status (for real-time updates)
export const updateMessageStatus = (messageId, newStatus) => {
  Object.keys(webhookMessages).forEach(conversationId => {
    webhookMessages[conversationId] = webhookMessages[conversationId].map(message => {
      if (message.id === messageId || message.meta_msg_id === messageId) {
        return {
          ...message,
          status: newStatus,
          status_timestamp: new Date().toISOString()
        }
      }
      return message
    })
  })
}

// Simulated database for processed_messages
export const processedMessages = []

// Function to save message to database
export const saveMessageToDatabase = (message) => {
  const processedMessage = {
    id: message.id,
    conversation_id: message.wa_id,
    text: message.text,
    timestamp: message.timestamp,
    from_me: message.from_me,
    status: message.status,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  
  processedMessages.push(processedMessage)
  console.log('Message saved to database:', processedMessage)
  return processedMessage
}