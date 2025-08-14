const express = require('express');
const { body, validationResult, param } = require('express-validator');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    });
  }
  next();
};

// Get all messages for a conversation
router.get('/conversation/:wa_id', [
  param('wa_id').notEmpty().withMessage('WhatsApp ID is required')
], handleValidationErrors, async (req, res) => {
  try {
    const { wa_id } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const messages = await Message.find({ wa_id })
      .sort({ timestamp: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({
      success: true,
      data: messages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: await Message.countDocuments({ wa_id })
      }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching messages',
      error: error.message
    });
  }
});

// Create new message from webhook
router.post('/webhook', [
  body('id').notEmpty().withMessage('Message ID is required'),
  body('meta_msg_id').notEmpty().withMessage('Meta message ID is required'),
  body('text').notEmpty().withMessage('Message text is required'),
  body('timestamp').isISO8601().withMessage('Valid timestamp is required'),
  body('from_me').isBoolean().withMessage('from_me must be boolean'),
  body('wa_id').notEmpty().withMessage('WhatsApp ID is required'),
  body('contact_name').notEmpty().withMessage('Contact name is required'),
  body('contact_phone').notEmpty().withMessage('Contact phone is required')
], handleValidationErrors, async (req, res) => {
  try {
    const messageData = req.body;

    // Check if message already exists
    const existingMessage = await Message.findOne({ id: messageData.id });
    if (existingMessage) {
      return res.status(409).json({
        success: false,
        message: 'Message already exists'
      });
    }

    // Create new message
    const message = new Message(messageData);
    await message.save();

    // Update or create conversation
    await updateConversation(messageData);

    res.status(201).json({
      success: true,
      message: 'Message created successfully',
      data: message
    });
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating message',
      error: error.message
    });
  }
});

// Update message status
router.patch('/status', [
  body('message_id').notEmpty().withMessage('Message ID is required'),
  body('status').isIn(['sent', 'delivered', 'read']).withMessage('Invalid status')
], handleValidationErrors, async (req, res) => {
  try {
    const { message_id, meta_msg_id, status } = req.body;

    // Find message by id or meta_msg_id
    const query = message_id ? { id: message_id } : { meta_msg_id };
    
    const message = await Message.findOneAndUpdate(
      query,
      { 
        status,
        status_timestamp: new Date()
      },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    res.json({
      success: true,
      message: 'Message status updated',
      data: message
    });
  } catch (error) {
    console.error('Error updating message status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating message status',
      error: error.message
    });
  }
});

// Send new message
router.post('/send', [
  body('wa_id').notEmpty().withMessage('WhatsApp ID is required'),
  body('text').notEmpty().withMessage('Message text is required'),
  body('contact_name').notEmpty().withMessage('Contact name is required'),
  body('contact_phone').notEmpty().withMessage('Contact phone is required')
], handleValidationErrors, async (req, res) => {
  try {
    const { wa_id, text, contact_name, contact_phone } = req.body;

    // Generate unique message ID
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const messageData = {
      id: messageId,
      meta_msg_id: messageId,
      text,
      timestamp: new Date(),
      type: 'text',
      from_me: true,
      wa_id,
      contact_name,
      contact_phone,
      status: 'sent'
    };

    const message = new Message(messageData);
    await message.save();

    // Update conversation
    await updateConversation(messageData);

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: message
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message',
      error: error.message
    });
  }
});

// Helper function to update conversation
async function updateConversation(messageData) {
  // For business messages, we need to find the customer's wa_id
  let conversationWaId = messageData.wa_id;
  let conversationName = messageData.contact_name;
  let conversationPhone = messageData.contact_phone;
  
  // If this is a business message, use the customer's details
  if (messageData.from_me) {
    // For business replies, the wa_id should be the customer's phone
    conversationWaId = messageData.contact_phone;
    conversationPhone = messageData.contact_phone;
  }

  const conversationUpdate = {
    wa_id: conversationWaId,
    name: conversationName,
    phone: conversationPhone,
    last_message: messageData.text,
    last_message_time: messageData.timestamp,
    $inc: { total_messages: 1 }
  };

  // Increment unread count only for incoming messages
  if (!messageData.from_me) {
    conversationUpdate.$inc.unread_count = 1;
  } else {
    conversationUpdate.unread_count = 0; // Reset unread count for outgoing messages
  }

  await Conversation.findOneAndUpdate(
    { wa_id: conversationWaId },
    conversationUpdate,
    { upsert: true, new: true }
  );
}

module.exports = router;