const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  // WhatsApp message ID
  id: {
    type: String,
    required: true,
    unique: true
  },
  // Meta message ID for status tracking
  meta_msg_id: {
    type: String,
    required: true
  },
  // Message content
  text: {
    type: String,
    required: true
  },
  // Message timestamp from WhatsApp
  timestamp: {
    type: Date,
    required: true
  },
  // Message type (text, image, document, etc.)
  type: {
    type: String,
    default: 'text'
  },
  // Whether message is from business (true) or customer (false)
  from_me: {
    type: Boolean,
    required: true
  },
  // WhatsApp ID of the contact
  wa_id: {
    type: String,
    required: true,
    index: true
  },
  // Contact name
  contact_name: {
    type: String,
    required: true
  },
  // Contact phone number
  contact_phone: {
    type: String,
    required: true
  },
  // Message status (sent, delivered, read)
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent'
  },
  // Status timestamp
  status_timestamp: {
    type: Date,
    default: Date.now
  },
  // Webhook metadata
  webhook_data: {
    entry_id: String,
    phone_number_id: String,
    display_phone_number: String
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Index for efficient queries
messageSchema.index({ wa_id: 1, timestamp: 1 });
messageSchema.index({ id: 1 });
messageSchema.index({ meta_msg_id: 1 });

module.exports = mongoose.model('Message', messageSchema);