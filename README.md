
# Watsap Clone

A comprehensive WhatsApp Business Web Interface with complete backend integration using MongoDB, featuring customer conversation management, WhatsApp Business API webhook processing, and message status tracking.

## 📱 What This Application Does

This is a **WhatsApp Business API client** that helps businesses manage customer conversations. It simulates a real business receiving and responding to customer messages through WhatsApp Business API.

**Business Scenario:**
- Customers message your business WhatsApp number
- Messages appear in this web interface (like WhatsApp Web for businesses)
- Customer service agents can respond to customers
- Track message delivery status (sent, delivered, read)
- Manage multiple customer conversations in one interface

**Sample Data Context:**
The webhook JSON files represent real customer conversations:
- **Ravi Kumar**: Customer asking about services
- **Neha Joshi**: Customer inquiring about products  
- **Business responses**: Professional replies to customers
- **Status updates**: Delivery confirmations from WhatsApp

## 🏗️ Architecture Overview

This application follows a modern full-stack architecture with clear separation between frontend and backend services:

```
┌─────────────────┐    HTTP/REST API    ┌─────────────────┐    MongoDB    ┌─────────────────┐
│                 │ ◄─────────────────► │                 │ ◄───────────► │                 │
│   React Frontend│                     │ Express Backend │               │   MongoDB       │
│   (Port 5173)   │                     │   (Port 5000)   │               │   Database      │
│                 │                     │                 │               │                 │
└─────────────────┘                     └─────────────────┘               └─────────────────┘
```

## 🎯 Features

### Frontend Features
- **Modern React UI** with component-based architecture
- **Real-time messaging interface** with WhatsApp-like design
- **Conversation management** with search and filtering
- **Message status indicators** (sent, delivered, read)
- **Responsive design** with dark/light theme support
- **Custom hooks** for API integration and state management

### Backend Features
- **RESTful API** with Express.js
- **MongoDB integration** with Mongoose ODM
- **Webhook processing** for WhatsApp Business API
- **Message status tracking** using id/meta_msg_id fields
- **Input validation** with Express Validator
- **Conversation grouping** by WhatsApp ID (wa_id)
- **Database seeding** from existing webhook data

## 🗂️ Project Structure

### Frontend Structure (`/frontend`)
```
frontend/
├── src/
│   ├── components/           # React components
│   │   ├── Sidebar.jsx      # Conversation list with search
│   │   ├── ChatArea.jsx     # Main chat interface
│   │   ├── ChatHeader.jsx   # Chat header with contact info
│   │   ├── MessageList.jsx  # Message display container
│   │   ├── MessageBubble.jsx # Individual message bubbles
│   │   ├── MessageInput.jsx # Message input with attachments
│   │   └── ConversationItem.jsx # Individual conversation items
│   ├── hooks/
│   │   └── useAPI.js        # Custom hooks for API integration
│   ├── services/
│   │   └── api.js           # Axios API client configuration
│   ├── App.jsx              # Main application component
│   └── main.jsx             # Application entry point
├── index.html               # HTML template
└── package.json             # Frontend dependencies
```

### Backend Structure (`/backend`)
```
backend/
├── models/
│   ├── Message.js           # MongoDB message schema
│   └── Conversation.js      # MongoDB conversation schema
├── routes/
│   ├── messageRoutes.js     # Message-related API endpoints
│   └── conversationRoutes.js # Conversation-related API endpoints
├── utils/
│   └── webhookProcessor.js  # WhatsApp webhook processing logic
├── scripts/
│   └── seedData.js          # Database seeding script
├── data/                    # Webhook JSON files
│   ├── conversation_1_message_1.json
│   ├── conversation_1_message_2.json
│   ├── conversation_1_status_1.json
│   ├── conversation_1_status_2.json
│   ├── conversation_2_message_1.json
│   ├── conversation_2_message_2.json
│   ├── conversation_2_status_1.json
│   └── conversation_2_status_2.json
├── server.js                # Express server configuration
└── package.json             # Backend dependencies
```

## 🗄️ Database Schema

### MongoDB Database: `whatsapp`

#### Collection: `messages`
Stores all WhatsApp messages with complete metadata:

```javascript
{
  id: "wamid.HBgMOTE5OTY3NTc4NzIwFQIAEhggMTIzQURFRjEyMzQ1Njc4OTA=", // WhatsApp message ID
  meta_msg_id: "wamid.HBgMOTE5OTY3NTc4NzIwFQIAEhggMTIzQURFRjEyMzQ1Njc4OTA=", // Meta message ID for status tracking
  text: "Hi, I'd like to know more about your services.", // Message content
  timestamp: "2025-01-06T12:00:00.000Z", // Message timestamp
  type: "text", // Message type (text, image, document, etc.)
  from_me: false, // Whether message is from business (true) or customer (false)
  wa_id: "919937320320", // WhatsApp ID (conversation identifier)
  contact_name: "Ravi Kumar", // Contact name
  contact_phone: "919937320320", // Contact phone number
  status: "read", // Message status (sent, delivered, read)
  status_timestamp: "2025-01-06T12:00:40.000Z", // Status update timestamp
  webhook_data: { // Original webhook metadata
    entry_id: "30164062719905277",
    phone_number_id: "629305560276479",
    display_phone_number: "918329446654"
  },
  createdAt: "2025-01-06T12:00:00.000Z", // Document creation time
  updatedAt: "2025-01-06T12:00:40.000Z"  // Document last update time
}
```

#### Collection: `conversations`
Maintains conversation metadata grouped by WhatsApp ID:

```javascript
{
  wa_id: "919937320320", // WhatsApp ID (unique identifier)
  name: "Ravi Kumar", // Contact name
  phone: "919937320320", // Contact phone number
  last_message: "Hi, I'd like to know more about your services.", // Last message content
  last_message_time: "2025-01-06T12:00:00.000Z", // Last message timestamp
  unread_count: 0, // Number of unread messages
  total_messages: 2, // Total message count in conversation
  is_active: true, // Whether conversation is active
  createdAt: "2025-01-06T12:00:00.000Z", // Conversation creation time
  updatedAt: "2025-01-06T12:00:40.000Z"  // Conversation last update time
}
```

## 🔄 Data Flow & Integration

### 1. Webhook Data Processing
The application processes WhatsApp Business API webhooks stored as JSON files:

**Message Webhooks** (`conversation_*_message_*.json`):
- Contain incoming/outgoing message data
- Include contact information and message content
- Processed by `WebhookProcessor.processMessageWebhook()`

**Status Webhooks** (`conversation_*_status_*.json`):
- Contain message status updates (sent, delivered, read)
- Use `id` or `meta_msg_id` to match with existing messages
- Processed by `WebhookProcessor.processStatusWebhook()`

### 2. Database Seeding Process
```bash
npm run seed # Runs backend/scripts/seedData.js
```

**Seeding Steps:**
1. **Clear Database**: Drops existing data to start fresh
2. **Process Message Webhooks**: Extracts and stores messages in MongoDB
3. **Process Status Webhooks**: Updates message statuses using id/meta_msg_id matching
4. **Create Conversations**: Groups messages by wa_id and creates conversation metadata

### 3. Frontend-Backend Integration

**API Communication Flow:**
```
Frontend Component → Custom Hook → API Service → Backend Route → MongoDB
```

**Example Message Flow:**
1. User types message in `MessageInput.jsx`
2. `ChatArea.jsx` calls `onSendMessage()`
3. `useMessages` hook calls `messageAPI.send()`
4. `api.js` makes POST request to `/api/messages/send`
5. `messageRoutes.js` validates and stores message in MongoDB
6. Response updates frontend state with new message

## 🛣️ API Routes

### Message Routes (`/api/messages`)

#### `GET /messages/conversation/:wa_id`
**Purpose**: Retrieve all messages for a specific conversation
**Parameters**: 
- `wa_id` (path): WhatsApp ID of the conversation
- `page` (query): Page number for pagination (default: 1)
- `limit` (query): Messages per page (default: 50)
**Response**: Array of messages sorted by timestamp
**MongoDB Query**: `Message.find({ wa_id }).sort({ timestamp: 1 })`

#### `POST /messages/send`
**Purpose**: Send a new message and update conversation
**Body**:
```javascript
{
  wa_id: "919937320320",
  text: "Hello, how can I help you?",
  contact_name: "Ravi Kumar",
  contact_phone: "919937320320"
}
```
**Process**:
1. Generates unique message ID
2. Creates message document in MongoDB
3. Updates/creates conversation with latest message info
4. Returns created message

#### `POST /messages/webhook`
**Purpose**: Process incoming WhatsApp webhook data
**Body**: Complete webhook payload from WhatsApp Business API
**Process**:
1. Extracts message data from webhook structure
2. Checks for duplicate messages using message ID
3. Stores new message in MongoDB
4. Updates conversation metadata

#### `PATCH /messages/status`
**Purpose**: Update message delivery status
**Body**:
```javascript
{
  message_id: "wamid.HBgMOTE5OTY3NTc4NzIwFQIAEhggMTIzQURFRjEyMzQ1Njc4OTA=",
  status: "read"
}
```
**Process**:
1. Finds message using `id` or `meta_msg_id`
2. Updates status and status_timestamp
3. Returns updated message

### Conversation Routes (`/api/conversations`)

#### `GET /conversations`
**Purpose**: Get all conversations with search and pagination
**Parameters**:
- `search` (query): Search term for name, phone, or wa_id
- `page` (query): Page number (default: 1)
- `limit` (query): Conversations per page (default: 20)
**Response**: Array of conversations sorted by last_message_time (descending)
**MongoDB Query**: 
```javascript
Conversation.find(searchQuery)
  .sort({ last_message_time: -1 })
  .limit(limit)
  .skip((page - 1) * limit)
```

#### `GET /conversations/:wa_id`
**Purpose**: Get specific conversation details
**Parameters**: `wa_id` (path): WhatsApp ID
**Response**: Single conversation object

#### `PATCH /conversations/:wa_id/read`
**Purpose**: Mark conversation as read (reset unread count)
**Process**: Sets `unread_count` to 0 for the specified conversation

#### `GET /conversations/:wa_id/stats`
**Purpose**: Get conversation statistics
**Response**:
```javascript
{
  total_messages: 15,
  sent_messages: 8,
  received_messages: 7,
  first_message: "2025-01-06T12:00:00.000Z",
  last_message: "2025-01-06T15:30:00.000Z"
}
```

### Health Check Route

#### `GET /api/health`
**Purpose**: Check API server status
**Response**: `{ status: 'OK', message: 'WhatsApp Backend is running' }`

## 🔧 Frontend Integration Details

### Custom Hooks (`src/hooks/useAPI.js`)

#### `useConversations(searchTerm)`
**Purpose**: Manage conversations state and operations
**Features**:
- Fetches conversations from API
- Handles search filtering
- Provides `markAsRead` function
- Auto-refetches on search term change

#### `useMessages(wa_id)`
**Purpose**: Manage messages for a specific conversation
**Features**:
- Fetches messages when wa_id changes
- Provides `sendMessage` function
- Handles `updateMessageStatus` for status changes
- Manages loading and error states

#### `useHealthCheck()`
**Purpose**: Monitor backend connectivity
**Features**:
- Checks API health every 30 seconds
- Provides connection status indicator

### API Service (`src/services/api.js`)

**Axios Configuration**:
- Base URL: `http://localhost:5000/api`
- Request/Response interceptors for logging
- Error handling for different HTTP status codes
- Automatic JSON parsing

**API Methods**:
- `conversationAPI`: CRUD operations for conversations
- `messageAPI`: Message operations and webhook processing
- `healthCheck`: Server status monitoring

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation & Setup

1. **Clone and Install Dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   ```

2. **Configure Environment**
   ```bash
   # Backend environment (.env in backend folder)
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/whatsapp
   NODE_ENV=development
   ```

3. **Start MongoDB**
   Ensure MongoDB is running on your system

4. **Seed Database with Webhook Data**
   ```bash
   cd backend
   npm run seed
   ```
   This processes all webhook JSON files and populates MongoDB

5. **Start Backend Server**
   ```bash
   cd backend
   npm run dev  # Uses nodemon for auto-restart
   ```

6. **Start Frontend Development Server**
   ```bash
   npm run dev  # Runs on http://localhost:5173
   ```

## 🔄 Webhook Processing Workflow

### Message Processing
1. **Webhook Reception**: JSON files simulate WhatsApp Business API webhooks
2. **Data Extraction**: `WebhookProcessor` extracts message data from nested webhook structure
3. **Message Creation**: New `Message` document created in MongoDB
4. **Conversation Update**: Corresponding `Conversation` updated with latest message info
5. **Status Tracking**: Initial status set to 'sent'

### Status Update Processing
1. **Status Webhook**: Contains delivery/read confirmations
2. **Message Matching**: Uses `id` or `meta_msg_id` to find corresponding message
3. **Status Update**: Message status updated (sent → delivered → read)
4. **Timestamp Recording**: Status change timestamp recorded

### Conversation Grouping Logic
- **Primary Key**: `wa_id` (WhatsApp ID) groups all messages from same user
- **Business Logic**: Messages from business phone vs. customer phone
- **Metadata Maintenance**: Last message, unread count, total messages automatically updated

## 🎨 UI/UX Features

### Theme System
- **Dark/Light Mode**: CSS custom properties for theme switching
- **Responsive Design**: Mobile-first approach with breakpoints
- **Modern Aesthetics**: Apple-inspired design with smooth animations

### Message Interface
- **Real-time Feel**: Optimistic UI updates with status simulation
- **Status Indicators**: Visual feedback for message delivery states
- **Date Grouping**: Messages grouped by date with separators
- **Search Functionality**: Real-time conversation filtering

## 🔒 Data Validation & Security

### Express Validator Integration
- **Input Sanitization**: All API inputs validated and sanitized
- **Type Checking**: Ensures correct data types for all fields
- **Required Fields**: Validates presence of mandatory fields
- **Error Handling**: Structured error responses for validation failures

### MongoDB Indexing
- **Performance Optimization**: Indexes on frequently queried fields
- **Unique Constraints**: Prevents duplicate messages using message ID
- **Compound Indexes**: Efficient queries for wa_id + timestamp combinations

## 🧪 Development & Testing

### Backend Development
```bash
cd backend
npm run dev     # Start with nodemon (auto-restart)
npm run seed    # Populate database with webhook data
npm start       # Production start
```

### Frontend Development
```bash
npm run dev     # Vite development server with HMR
npm run build   # Production build
npm run preview # Preview production build
```

### API Testing
Use tools like Postman or curl to test API endpoints:
```bash
# Get all conversations
curl http://localhost:5000/api/conversations

# Get messages for a conversation
curl http://localhost:5000/api/messages/conversation/919937320320

# Send a message
curl -X POST http://localhost:5000/api/messages/send \
  -H "Content-Type: application/json" \
  -d '{"wa_id":"919937320320","text":"Hello","contact_name":"Test","contact_phone":"919937320320"}'
```

## 📊 Monitoring & Logging

### Backend Logging
- **Request Logging**: All API requests logged with method and URL
- **Error Logging**: Detailed error information for debugging
- **Database Operations**: MongoDB operations logged for monitoring

### Frontend Monitoring
- **API Health Check**: Continuous backend connectivity monitoring
- **Error Boundaries**: Graceful error handling in React components
- **Loading States**: User feedback during API operations

## 🔮 Future Enhancements

### Planned Features
- **Real-time WebSocket Integration**: Live message updates
- **File Upload Support**: Image and document sharing
- **Push Notifications**: Browser notification API integration
- **Message Encryption**: End-to-end encryption implementation
- **User Authentication**: Multi-user support with authentication
- **Message Search**: Full-text search across all messages
- **Export Functionality**: Conversation export to various formats

### Scalability Considerations
- **Database Sharding**: Horizontal scaling for large datasets
- **Caching Layer**: Redis integration for frequently accessed data
- **CDN Integration**: Static asset optimization
- **Load Balancing**: Multiple backend instances for high availability

---

This WhatsApp Web clone demonstrates modern full-stack development practices with React, Express.js, and MongoDB, providing a solid foundation for real-world messaging applications.











--------------------------------------------------------------------------------------------------------------------------------------------------------
<!-- # Watsap Clone

This is a WhatsApp Web clone with a complete backend integration using MongoDB.

## Features

- **Frontend**: React + Vite with modern UI components
- **Backend**: Node.js + Express + MongoDB
- **Real-time messaging** with status indicators (sent, delivered, read)
- **Conversation management** grouped by WhatsApp ID
- **Webhook processing** for WhatsApp Business API integration
- **Search functionality** for conversations
- **Responsive design** with dark/light theme support

## Tech Stack

### Frontend
- React 18 with Hooks
- Vite for build tooling
- Axios for API communication
- React Icons for UI icons
- CSS custom properties for theming

### Backend
- Node.js + Express.js
- MongoDB with Mongoose ODM
- Express Validator for input validation
- CORS for cross-origin requests
- Nodemon for development

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd whatsapp-web-clone
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Set up environment variables**
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/whatsapp
   NODE_ENV=development
   ```

5. **Start MongoDB**
   Make sure MongoDB is running on your system.

6. **Seed the database**
   ```bash
   cd backend
   npm run seed
   ```

7. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```

8. **Start the frontend development server**
   ```bash
   npm run dev
   ```

## API Endpoints

### Conversations
- `GET /api/conversations` - Get all conversations
- `GET /api/conversations/:wa_id` - Get specific conversation
- `PATCH /api/conversations/:wa_id/read` - Mark conversation as read
- `GET /api/conversations/:wa_id/stats` - Get conversation statistics

### Messages
- `GET /api/messages/conversation/:wa_id` - Get messages for a conversation
- `POST /api/messages/send` - Send a new message
- `POST /api/messages/webhook` - Process webhook message
- `PATCH /api/messages/status` - Update message status

### Health Check
- `GET /api/health` - Check API health status

## Database Schema

### Messages Collection
```javascript
{
  id: String,              // WhatsApp message ID
  meta_msg_id: String,     // Meta message ID for status tracking
  text: String,            // Message content
  timestamp: Date,         // Message timestamp
  type: String,            // Message type (text, image, etc.)
  from_me: Boolean,        // Whether message is from business
  wa_id: String,           // WhatsApp ID (conversation identifier)
  contact_name: String,    // Contact name
  contact_phone: String,   // Contact phone number
  status: String,          // Message status (sent, delivered, read)
  status_timestamp: Date,  // Status update timestamp
  webhook_data: Object     // Original webhook metadata
}
```

### Conversations Collection
```javascript
{
  wa_id: String,           // WhatsApp ID (unique)
  name: String,            // Contact name
  phone: String,           // Contact phone number
  last_message: String,    // Last message content
  last_message_time: Date, // Last message timestamp
  unread_count: Number,    // Unread message count
  total_messages: Number,  // Total message count
  is_active: Boolean       // Whether conversation is active
}
```

## Webhook Processing

The system processes WhatsApp Business API webhooks to:
1. Extract message data from webhook payloads
2. Store messages in MongoDB with proper indexing
3. Update message statuses using `id` or `meta_msg_id` fields
4. Maintain conversation metadata and unread counts
5. Group conversations by WhatsApp ID (`wa_id`)

## Development

### Frontend Development
- Hot reload enabled with Vite
- Component-based architecture
- Custom hooks for API integration
- Responsive design with CSS custom properties

### Backend Development
- Nodemon for auto-restart on changes
- Express validator for input validation
- Mongoose for MongoDB operations
- Structured error handling and logging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request
 -->
