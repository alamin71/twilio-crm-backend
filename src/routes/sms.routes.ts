import express from 'express';
import {
  sendSMS,
  getMessages,
  markRead,
  incomingWebhook,
} from '../controllers/sms.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/send', authenticateJWT, sendSMS);
router.get('/messages', authenticateJWT, getMessages);
router.post('/mark-read', authenticateJWT, markRead);

// Twilio incoming SMS webhook (no auth)
router.post('/incoming-webhook', incomingWebhook);

export default router;
