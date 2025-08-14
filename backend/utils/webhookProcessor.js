const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

class WebhookProcessor {
  // Process incoming message webhook
  static async processMessageWebhook(webhookData) {
    try {
      const entry = webhookData.metaData.entry[0];
      const change = entry.changes[0];
      const value = change.value;

      if (!value.messages) {
        throw new Error('No messages found in webhook data');
      }

      const message = value.messages[0];
      const contact = value.contacts?.[0];
      const businessPhone = value.metadata?.display_phone_number;

      // Determine if message is from business or customer
      const fromMe = message.from === businessPhone;
      
      // Always use customer phone as conversation identifier
      const waId = fromMe ? 
        (contact?.wa_id || message.from) : // For business messages, use contact wa_id or recipient
        message.from; // For customer messages, use sender

      const messageData = {
        id: message.id,
        meta_msg_id: message.id,
        text: message.text.body,
        timestamp: new Date(parseInt(message.timestamp) * 1000),
        type: message.type || 'text',
        from_me: fromMe,
        wa_id: waId,
        contact_name: contact?.profile?.name || 'Unknown',
        contact_phone: fromMe ? (contact?.wa_id || waId) : message.from,
        status: 'sent',
        webhook_data: {
          entry_id: entry.id,
          phone_number_id: value.metadata?.phone_number_id,
          display_phone_number: businessPhone
        }
      };

      // Check if message already exists
      const existingMessage = await Message.findOne({ id: message.id });
      if (existingMessage) {
        console.log(`Message ${message.id} already exists`);
        return existingMessage;
      }

      // Save message
      const newMessage = new Message(messageData);
      await newMessage.save();

      // Update conversation
      await this.updateConversation(messageData);

      console.log(`Processed message: ${message.id}`);
      return newMessage;

    } catch (error) {
      console.error('Error processing message webhook:', error);
      throw error;
    }
  }

  // Process status update webhook
  static async processStatusWebhook(webhookData) {
    try {
      const entry = webhookData.metaData.entry[0];
      const change = entry.changes[0];
      const value = change.value;

      if (!value.statuses) {
        throw new Error('No statuses found in webhook data');
      }

      const status = value.statuses[0];
      const statusData = {
        message_id: status.id,
        meta_msg_id: status.meta_msg_id || status.id,
        status: status.status,
        timestamp: new Date(parseInt(status.timestamp) * 1000),
        recipient_id: status.recipient_id
      };

      // Find and update message by id or meta_msg_id
      const query = {
        $or: [
          { id: statusData.message_id },
          { meta_msg_id: statusData.meta_msg_id }
        ]
      };

      const updatedMessage = await Message.findOneAndUpdate(
        query,
        {
          status: statusData.status,
          status_timestamp: statusData.timestamp
        },
        { new: true }
      );

      if (!updatedMessage) {
        console.log(`Message not found for status update: ${statusData.message_id}`);
        return null;
      }

      console.log(`Updated message status: ${statusData.message_id} -> ${statusData.status}`);
      return updatedMessage;

    } catch (error) {
      console.error('Error processing status webhook:', error);
      throw error;
    }
  }

  // Update or create conversation
  static async updateConversation(messageData) {
    try {
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
        conversationUpdate.unread_count = 0;
      }

      const conversation = await Conversation.findOneAndUpdate(
        { wa_id: conversationWaId },
        conversationUpdate,
        { upsert: true, new: true }
      );

      return conversation;
    } catch (error) {
      console.error('Error updating conversation:', error);
      throw error;
    }
  }

  // Process all webhook files from the project
  static async processExistingWebhooks() {
    try {
      // Import webhook data (you'll need to adjust paths based on your structure)
      const webhookFiles = [
        require('../data/conversation_1_message_1.json'),
        require('../data/conversation_1_message_2.json'),
        require('../data/conversation_2_message_1.json'),
        require('../data/conversation_2_message_2.json')
      ];

      const statusFiles = [
        require('../data/conversation_1_status_1.json'),
        require('../data/conversation_1_status_2.json'),
        require('../data/conversation_2_status_1.json'),
        require('../data/conversation_2_status_2.json')
      ];

      // Process messages
      for (const webhook of webhookFiles) {
        await this.processMessageWebhook(webhook);
      }

      // Process status updates
      for (const webhook of statusFiles) {
        await this.processStatusWebhook(webhook);
      }

      console.log('All existing webhooks processed successfully');
    } catch (error) {
      console.error('Error processing existing webhooks:', error);
      throw error;
    }
  }
}

module.exports = WebhookProcessor;