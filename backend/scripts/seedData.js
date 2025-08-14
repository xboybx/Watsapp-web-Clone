const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const WebhookProcessor = require('../utils/webhookProcessor');

// Import webhook data
const conv1msg1 = require('../data/conversation_1_message_1.json');
const conv1msg2 = require('../data/conversation_1_message_2.json');
const conv1status1 = require('../data/conversation_1_status_1.json');
const conv1status2 = require('../data/conversation_1_status_2.json');
const conv2msg1 = require('../data/conversation_2_message_1.json');
const conv2msg2 = require('../data/conversation_2_message_2.json');
const conv2status1 = require('../data/conversation_2_status_1.json');
const conv2status2 = require('../data/conversation_2_status_2.json');

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await mongoose.connection.db.dropDatabase();
    console.log('Database cleared');

    // Process message webhooks
    console.log('Processing message webhooks...');
    await WebhookProcessor.processMessageWebhook(conv1msg1);
    await WebhookProcessor.processMessageWebhook(conv1msg2);
    await WebhookProcessor.processMessageWebhook(conv2msg1);
    await WebhookProcessor.processMessageWebhook(conv2msg2);

    // Process status webhooks
    console.log('Processing status webhooks...');
    const statusWebhooks = [conv1status1, conv1status2, conv2status1, conv2status2];
    for (const webhook of statusWebhooks) {
      if (webhook.metaData.entry[0].changes[0].value.statuses) {
        await WebhookProcessor.processStatusWebhook(webhook);
      } else {
        console.log('Skipping status webhook without statuses field:', webhook._id || 'unknown');
      }
    }

    // Log final conversation count for verification
    const Message = require('../models/Message');
    const Conversation = require('../models/Conversation');
    
    const totalMessages = await Message.countDocuments();
    const totalConversations = await Conversation.countDocuments();
    
    console.log(`\n=== Database Seeding Complete ===`);
    console.log(`Total Messages: ${totalMessages}`);
    console.log(`Total Conversations: ${totalConversations}`);
    
    const conversations = await Conversation.find().sort({ last_message_time: -1 });
    console.log('\nConversations created:');
    conversations.forEach(conv => {
      console.log(`- ${conv.name} (${conv.wa_id}): ${conv.total_messages} messages`);
    });
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();