const express = require('express');
const { query, param, validationResult } = require('express-validator');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

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

// Get all conversations
router.get('/', [
  query('search').optional().isString().withMessage('Search must be a string'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
], handleValidationErrors, async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;

    // Build search query
    let searchQuery = { is_active: true };
    if (search) {
      searchQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { wa_id: { $regex: search, $options: 'i' } }
      ];
    }

    const conversations = await Conversation.find(searchQuery)
      .sort({ last_message_time: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Conversation.countDocuments(searchQuery);

    res.json({
      success: true,
      data: conversations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching conversations',
      error: error.message
    });
  }
});

// Get conversation by wa_id
router.get('/:wa_id', [
  param('wa_id').notEmpty().withMessage('WhatsApp ID is required')
], handleValidationErrors, async (req, res) => {
  try {
    const { wa_id } = req.params;

    const conversation = await Conversation.findOne({ wa_id });
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    res.json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching conversation',
      error: error.message
    });
  }
});

// Mark conversation as read
router.patch('/:wa_id/read', [
  param('wa_id').notEmpty().withMessage('WhatsApp ID is required')
], handleValidationErrors, async (req, res) => {
  try {
    const { wa_id } = req.params;

    const conversation = await Conversation.findOneAndUpdate(
      { wa_id },
      { unread_count: 0 },
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    res.json({
      success: true,
      message: 'Conversation marked as read',
      data: conversation
    });
  } catch (error) {
    console.error('Error marking conversation as read:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking conversation as read',
      error: error.message
    });
  }
});

// Get conversation statistics
router.get('/:wa_id/stats', [
  param('wa_id').notEmpty().withMessage('WhatsApp ID is required')
], handleValidationErrors, async (req, res) => {
  try {
    const { wa_id } = req.params;

    const stats = await Message.aggregate([
      { $match: { wa_id } },
      {
        $group: {
          _id: null,
          total_messages: { $sum: 1 },
          sent_messages: { $sum: { $cond: [{ $eq: ['$from_me', true] }, 1, 0] } },
          received_messages: { $sum: { $cond: [{ $eq: ['$from_me', false] }, 1, 0] } },
          first_message: { $min: '$timestamp' },
          last_message: { $max: '$timestamp' }
        }
      }
    ]);

    res.json({
      success: true,
      data: stats[0] || {
        total_messages: 0,
        sent_messages: 0,
        received_messages: 0,
        first_message: null,
        last_message: null
      }
    });
  } catch (error) {
    console.error('Error fetching conversation stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching conversation stats',
      error: error.message
    });
  }
});

module.exports = router;