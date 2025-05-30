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
  const client = Twilio(twilioSid, twilioToken);
  const msgOptions: any = { body, from: fromNumber, to: toNumber };

  if (mediaUrls.length > 0) {
    msgOptions.mediaUrl = mediaUrls;
  }

  try {
    // make massage from twilio
    const message = await client.messages.create(msgOptions);

    // Conversation ID ফর্ম্যাট — দুই নম্বর sort করে হ্যান্ডেল করা
    const conversationId = [fromNumber, toNumber].sort().join('-');

    // send massage clinent api
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
    await axios.post(CLIENT_API_URL, payload, {
      headers: { 'Content-Type': 'application/json' },
    });

    // massage save to database
    return await MessageModel.create({
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
  } catch (error) {
    console.error('Error in sendMessage:', error);
    throw error;
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
