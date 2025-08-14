@@ .. @@
 // Helper function to extract message data from webhook
 const extractMessageFromWebhook = (webhook) => {
   const entry = webhook.metaData.entry[0]
   const change = entry.changes[0]
   const value = change.value
   
   if (value.messages) {
     const message = value.messages[0]
     const contact = value.contacts?.[0]
     const businessPhone = value.metadata?.display_phone_number
     
+    // Determine if message is from business or customer
+    const fromMe = message.from === businessPhone
+    
+    // Always use customer phone as conversation identifier
+    const waId = fromMe ? 
+      (contact?.wa_id || message.from) : // For business messages, use contact wa_id
+      message.from // For customer messages, use sender
+    
     return {
       id: message.id,
       meta_msg_id: message.id, // Use same ID for meta_msg_id
       text: message.text.body,
       timestamp: new Date(parseInt(message.timestamp) * 1000).toISOString(),
       type: 'text',
-      from_me: message.from === businessPhone,
-      wa_id: message.from === businessPhone ? businessPhone : message.from,
+      from_me: fromMe,
// Group messages by conversation (wa_id) - always group by customer phone
       contact_name: contact?.profile?.name || 'Unknown',
  // Always use customer phone as conversation key
  const conversationKey = message.from_me ? message.contact_phone : message.wa_id
       status: 'sent' // Initial status
     }
   }
   return null
 }