const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  // WhatsApp ID (unique identifier for each conversation)
  wa_id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  // Contact name
  name: {
    type: String,
    required: true
  },
  // Contact phone number
  phone: {
    type: String,
    required: true
  },
  // Last message content
  last_message: {
    type: String,
    default: ''
  },
  // Last message timestamp
  last_message_time: {
    type: Date,
    default: Date.now
  },
  // Unread message count
  unread_count: {
    type: Number,
    default: 0
  },
  // Total message count
  total_messages: {
    type: Number,
    default: 0
  },
  // Whether conversation is active
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient sorting and querying
conversationSchema.index({ last_message_time: -1 });

module.exports = mongoose.model('Conversation', conversationSchema);