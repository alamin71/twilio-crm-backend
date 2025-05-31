import Twilio from 'twilio';
import MessageModel from '../models/message.model';
import axios from 'axios';

const CLIENT_API_URL =
  process.env.CLIENT_API_URL ||
  'https://prod-54.westus.logic.azure.com:443/workflows/4bd824b90c604ef1958c438f61c4dfc5/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=TDNg2ZCfMjYFNtvyZartu9BBAwAUzcuqacwyRkHJVHE';

export const sendMessage = async (
  twilioSid: string,
  twilioToken: string,
  fromNumber: string,
  toNumber: string,
  body: string,
  mediaUrls: string[] = [],
  customerFullName: string = '400 - New Contact',
  customerCompanyName: string = '',
) => {
  if (!twilioSid || !twilioToken) {
    throw new Error('Twilio SID and Token are required');
  }
  if (!fromNumber || !toNumber) {
    throw new Error('From and To phone numbers are required');
  }
  if (!body) {
    throw new Error('Message body is required');
  }

  // Initialize Twilio client
  const client = Twilio(twilioSid, twilioToken);

  const msgOptions: {
    body: string;
    from: string;
    to: string;
    mediaUrl?: string[];
  } = {
    body,
    from: fromNumber,
    to: toNumber,
  };

  if (mediaUrls.length > 0) {
    msgOptions.mediaUrl = mediaUrls;
  }

  try {
    // Send message using Twilio
    const message = await client.messages.create(msgOptions);

    // Create a conversation ID by sorting the numbers
    const conversationId = [fromNumber, toNumber].sort().join('-');

    // Prepare payload for client API
    const payload = {
      request: 'SMS Message',
      message_sid: message.sid,
      agent_phone: fromNumber,
      customer_phone: toNumber,
      customer_full_name: customerFullName,
      customer_company_name: customerCompanyName,
      direction: 'Out',
      message: body,
      run_ai: true,
    };

    try {
      // Send to client API - may fail but should not block saving message
      await axios.post(CLIENT_API_URL, payload, {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (axiosError) {
      console.error('Error posting to client API:', axiosError);
      // You may choose to proceed or throw error here depending on your logic
    }

    // Save message in DB
    const savedMessage = await MessageModel.create({
      conversationId,
      from: fromNumber,
      to: toNumber,
      body,
      mediaUrls,
      direction: 'outbound',
      status: message.status,
      read: true,
      timestamp: message.dateCreated
        ? new Date(message.dateCreated)
        : new Date(),
    });

    return savedMessage;
  } catch (error) {
    console.error('Error sending Twilio message:', error);
    throw new Error(
      `Failed to send message: ${error instanceof Error ? error.message : error}`,
    );
  }
};

export const handleIncomingMessage = async (data: any) => {
  try {
    const { From, To, Body, NumMedia, MessageSid } = data;

    if (!From || !To || !Body || !MessageSid) {
      throw new Error('Missing required fields in incoming message data');
    }

    const mediaUrls: string[] = [];
    const mediaCount = Number(NumMedia) || 0;
    for (let i = 0; i < mediaCount; i++) {
      const url = data[`MediaUrl${i}`];
      if (url) mediaUrls.push(url);
    }

    const conversationId = [From, To].sort().join('-');

    // send incoming message to client api
    const payload = {
      request: 'SMS Message',
      message_sid: MessageSid,
      agent_phone: To,
      customer_phone: From,
      customer_full_name: '400 - New Contact',
      customer_company_name: '',
      direction: 'In',
      message: Body,
      run_ai: true,
    };

    await axios.post(CLIENT_API_URL, payload, {
      headers: { 'Content-Type': 'application/json' },
    });

    // incoming massge save to db
    return await MessageModel.create({
      conversationId,
      from: From,
      to: To,
      body: Body,
      mediaUrls,
      direction: 'inbound',
      read: false,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Error in handleIncomingMessage:', error);
    throw error;
  }
};
