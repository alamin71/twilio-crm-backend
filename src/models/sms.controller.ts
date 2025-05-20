import { Request, Response } from 'express';
import * as smsService from '../services/sms.service';

export const sendSMS = async (req: Request, res: Response) => {
  const { toNumber, body, mediaUrls } = req.body;
  const user = req.user as any;

  try {
    const message = await smsService.sendMessage(
      user.twilioSid,
      user.twilioToken,
      user.twilioPhoneNumber,
      toNumber,
      body,
      mediaUrls || [],
    );
    res.status(200).json({ message: 'Message sent', data: message });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: 'Failed to send message', details: error.message });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  const { conversationId, search, limit, skip } = req.query;

  if (!conversationId)
    return res.status(400).json({ error: 'conversationId is required' });

  try {
    const messages = await smsService.fetchMessages(
      conversationId as string,
      (search as string) || '',
      Number(limit) || 20,
      Number(skip) || 0,
    );
    res.status(200).json({ data: messages });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: 'Failed to fetch messages', details: error.message });
  }
};

export const markRead = async (req: Request, res: Response) => {
  const { messageId } = req.body;

  if (!messageId)
    return res.status(400).json({ error: 'messageId is required' });

  try {
    const message = await smsService.markAsRead(messageId);
    res.status(200).json({ message: 'Message marked as read', data: message });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: 'Failed to update message', details: error.message });
  }
};

export const incomingWebhook = async (req: Request, res: Response) => {
  try {
    await smsService.handleIncomingMessage(req.body);
    res.status(200).send('<Response></Response>');
  } catch (error) {
    res.status(500).send('<Response></Response>');
  }
};
