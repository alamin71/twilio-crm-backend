import { Schema, model } from 'mongoose';

const MessageSchema = new Schema({
  conversationId: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  body: { type: String, default: '' },
  mediaUrls: { type: [String], default: [] },
  direction: { type: String, enum: ['inbound', 'outbound'], required: true },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'failed', 'queued'],
    default: 'sent',
  },
  read: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
});

export default model('Message', MessageSchema);
