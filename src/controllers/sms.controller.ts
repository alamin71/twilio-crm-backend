import { Request, Response } from 'express';
import { handleIncomingMessage, sendMessage } from '../services/sms.service';

const AGENT_NUMBER = process.env.AGENT_NUMBER || '+17206055746';

// Send SMS API Controller
export const sendMessageController = async (req: Request, res: Response) => {
  try {
    const {
      twilioSid,
      twilioToken,
      fromNumber,
      toNumber,
      body,
      mediaUrls,
      customerFullName,
      customerCompanyName,
    } = req.body;

    if (!twilioSid || !twilioToken || !fromNumber || !toNumber || !body) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing required fields' });
    }

    const savedMessage = await sendMessage(
      twilioSid,
      twilioToken,
      fromNumber,
      toNumber,
      body,
      mediaUrls || [],
      customerFullName || '400 - New Contact',
      customerCompanyName || '',
    );

    res.status(200).json({ success: true, message: savedMessage });
  } catch (error: any) {
    console.error('Error sending SMS:', error);
    res
      .status(500)
      .json({ success: false, error: error.message || 'Server error' });
  }
};

// Incoming SMS webhook handler Controller
export const smsWebhookHandler = async (req: Request, res: Response) => {
  try {
    await handleIncomingMessage(req.body);
    res.status(200).send('<Response></Response>');
  } catch (error) {
    console.error('Error handling incoming SMS webhook:', error);
    res.status(500).send('Server error');
  }
};
