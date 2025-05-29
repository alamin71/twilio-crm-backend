// import { Request, Response } from 'express';
// import axios from 'axios';

// const CLIENT_API_URL =
//   'https://prod-54.westus.logic.azure.com/your-client-api-endpoint'; // তোমার ক্লায়েন্ট API URL

// export const smsWebhookHandler = async (req: Request, res: Response) => {
//   try {
//     const { MessageSid, From, To, Body } = req.body;

//     // direction নির্ধারণ (যেমন: From হলো agent নম্বর হলে Out, না হলে In)
//     const agentNumber = '+15559876543'; // তোমার agent phone number
//     const direction = From === agentNumber ? 'Out' : 'In';

//     // ক্লায়েন্ট API তে POST রিকোয়েস্ট পাঠানো
//     await axios.post(
//       CLIENT_API_URL,
//       {
//         request: 'SMS Message',
//         message_sid: MessageSid,
//         agent: agentNumber,
//         customer: direction === 'In' ? From : To,
//         direction,
//         message: Body,
//         run_ai: true, // বা প্রয়োজন মতো false দিতে পারো
//       },
//       {
//         headers: { 'Content-Type': 'application/json' },
//       },
//     );

//     // Twilio কে 200 OK পাঠানো (TwiML Response না দিলেও চলে)
//     res.status(200).send('<Response></Response>');
//   } catch (error) {
//     console.error('Error sending message data to client API:', error);
//     res.status(500).send('Server error');
//   }
// };
// import { Request, Response } from 'express';
// import axios from 'axios';
// import Twilio from 'twilio';
// import MessageModel from '../models/message.model';

// // ক্লায়েন্ট API URL
// const CLIENT_API_URL =
//   'https://prod-54.westus.logic.azure.com/your-client-api-endpoint';

// // Twilio থেকে মেসেজ পাঠানোর ফাংশন
// export const sendMessage = async (
//   twilioSid: string,
//   twilioToken: string,
//   fromNumber: string,
//   toNumber: string,
//   body: string,
//   mediaUrls: string[] = [],
// ) => {
//   const client = Twilio(twilioSid, twilioToken);
//   const msgOptions: any = { body, from: fromNumber, to: toNumber };

//   if (mediaUrls.length > 0) {
//     msgOptions.mediaUrl = mediaUrls;
//   }

//   // Twilio থেকে মেসেজ তৈরি করা
//   const message = await client.messages.create(msgOptions);

//   // Conversation ID ফর্ম্যাট (এটা দিয়ে আলাদা আলাদা চ্যাট সেশন ট্র্যাক করা হবে)
//   const conversationId =
//     toNumber > fromNumber
//       ? `${fromNumber}-${toNumber}`
//       : `${toNumber}-${fromNumber}`;

//   // ক্লায়েন্ট API তে মেসেজ পাঠানো
//   await axios.post(
//     CLIENT_API_URL,
//     {
//       request: 'SMS Message',
//       message_sid: message.sid,
//       agent: fromNumber,
//       customer: toNumber,
//       direction: 'Out', // Outbound message
//       message: body,
//       run_ai: true, // চাইলে ফ্ল্যাগটা false বা ক্লায়েন্টের চাহিদা অনুযায়ী সেট করতে পারো
//     },
//     {
//       headers: { 'Content-Type': 'application/json' },
//     },
//   );

//   // মেসেজটি ডাটাবেজে সেভ করা
//   return await MessageModel.create({
//     conversationId,
//     from: fromNumber,
//     to: toNumber,
//     body,
//     mediaUrls,
//     direction: 'outbound',
//     status: message.status,
//     read: true,
//     timestamp: new Date(message.dateCreated),
//   });
// };

// // Incoming message handler (Twilio webhook)
// export const smsWebhookHandler = async (req: Request, res: Response) => {
//   try {
//     const { MessageSid, From, To, Body, NumMedia } = req.body;

//     // media URLs সংগ্রহ করা
//     const mediaUrls = [];
//     for (let i = 0; i < Number(NumMedia); i++) {
//       mediaUrls.push(req.body[`MediaUrl${i}`]);
//     }

//     // direction নির্ধারণ (যেমন: From হলো agent নম্বর হলে Out, না হলে In)
//     const agentNumber = '+15559876543'; // তোমার agent phone number
//     const direction = From === agentNumber ? 'Out' : 'In';

//     // ক্লায়েন্ট API তে POST রিকোয়েস্ট পাঠানো
//     await axios.post(
//       CLIENT_API_URL,
//       {
//         request: 'SMS Message',
//         message_sid: MessageSid,
//         agent: agentNumber,
//         customer: direction === 'In' ? From : To,
//         direction,
//         message: Body,
//         run_ai: true, // বা প্রয়োজন মতো false দিতে পারো
//       },
//       {
//         headers: { 'Content-Type': 'application/json' },
//       },
//     );

//     // Twilio কে 200 OK পাঠানো (TwiML Response না দিলেও চলে)
//     res.status(200).send('<Response></Response>');
//   } catch (error) {
//     console.error('Error sending message data to client API:', error);
//     res.status(500).send('Server error');
//   }
// };
import { Request, Response } from 'express';
import axios from 'axios';
import Twilio from 'twilio';
import MessageModel from '../models/message.model';

// ক্লায়েন্ট API URL (এটি env ফাইলে রাখা উচিত)
const CLIENT_API_URL =
  process.env.CLIENT_API_URL ||
  'https://prod-54.westus.logic.azure.com/your-client-api-endpoint';

// Agent নম্বর env থেকে নেওয়া ভাল, fallback হিসেবে নিচে দেয়া আছে
const AGENT_NUMBER = process.env.AGENT_NUMBER || '+15559876543';

// Twilio থেকে মেসেজ পাঠানোর ফাংশন
export const sendMessage = async (
  twilioSid: string,
  twilioToken: string,
  fromNumber: string,
  toNumber: string,
  body: string,
  mediaUrls: string[] = [],
) => {
  try {
    const client = Twilio(twilioSid, twilioToken);
    const msgOptions: any = { body, from: fromNumber, to: toNumber };

    if (mediaUrls.length > 0) {
      msgOptions.mediaUrl = mediaUrls;
    }

    // Twilio থেকে মেসেজ তৈরি করা
    const message = await client.messages.create(msgOptions);

    // Conversation ID ফর্ম্যাট
    const conversationId =
      toNumber > fromNumber
        ? `${fromNumber}-${toNumber}`
        : `${toNumber}-${fromNumber}`;

    // ক্লায়েন্ট API তে মেসেজ ডাটা পাঠানো
    await axios.post(
      CLIENT_API_URL,
      {
        request: 'SMS Message',
        message_sid: message.sid,
        agent: fromNumber,
        customer: toNumber,
        direction: 'Out',
        message: body,
        run_ai: true, // প্রয়োজন অনুযায়ী পরিবর্তন করুন
      },
      { headers: { 'Content-Type': 'application/json' } },
    );

    // মেসেজ ডাটাবেজে সেভ করা
    const savedMessage = await MessageModel.create({
      conversationId,
      from: fromNumber,
      to: toNumber,
      body,
      mediaUrls,
      direction: 'outbound',
      status: message.status,
      read: true,
      timestamp: new Date(message.dateCreated),
    });

    return savedMessage;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
};

// Incoming message handler (Twilio webhook)
export const smsWebhookHandler = async (req: Request, res: Response) => {
  try {
    const { MessageSid, From, To, Body, NumMedia } = req.body;

    // মিডিয়া URL গুলো সংগ্রহ
    const mediaUrls: string[] = [];
    for (let i = 0; i < Number(NumMedia); i++) {
      const mediaUrl = req.body[`MediaUrl${i}`];
      if (mediaUrl) mediaUrls.push(mediaUrl);
    }

    // মেসেজ ডিরেকশন নির্ধারণ
    const direction = From === AGENT_NUMBER ? 'Out' : 'In';

    // ক্লায়েন্ট API তে POST রিকোয়েস্ট
    await axios.post(
      CLIENT_API_URL,
      {
        request: 'SMS Message',
        message_sid: MessageSid,
        agent: AGENT_NUMBER,
        customer: direction === 'In' ? From : To,
        direction,
        message: Body,
        mediaUrls,
        run_ai: true,
      },
      { headers: { 'Content-Type': 'application/json' } },
    );

    // ২০০ OK রেসপন্স টুইলিওকে পাঠানো (TwiML Response না দিলেও চলে)
    res.status(200).send('<Response></Response>');
  } catch (error) {
    console.error('Error handling incoming SMS webhook:', error);
    res.status(500).send('Server error');
  }
};
