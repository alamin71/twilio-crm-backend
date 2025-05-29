import express from 'express';
import { sendMessage, smsWebhookHandler } from '../controllers/sms.controller';
// import { sendMessage, smsWebhookHandler } from './sms.controller';

const router = express.Router();

// Send SMS via API (POST /api/sms/send)
router.post('/send', async (req, res) => {
  try {
    const { twilioSid, twilioToken, fromNumber, toNumber, body, mediaUrls } =
      req.body;

    if (!twilioSid || !twilioToken || !fromNumber || !toNumber || !body) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing required fields' });
    }

    const message = await sendMessage(
      twilioSid,
      twilioToken,
      fromNumber,
      toNumber,
      body,
      mediaUrls || [],
    );
    res.status(200).json({ success: true, message });
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, error: error.message || 'Server error' });
  }
});

// Twilio SMS webhook handler (POST /api/sms/webhook)
router.post('/webhook', smsWebhookHandler);

export default router;
