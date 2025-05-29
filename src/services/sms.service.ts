// import Twilio from 'twilio';
// import MessageModel from '../models/message.model';
// import axios from 'axios';

// const CLIENT_API_URL =
//   'https://prod-54.westus.logic.azure.com:443/workflows/4bd824b90c604ef1958c438f61c4dfc5/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=TDNg2ZCfMjYFNtvyZartu9BBAwAUzcuqacwyRkHJVHE';

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
//       direction: 'Out',
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

// export const fetchMessages = async (
//   conversationId: string,
//   searchText: string = '',
//   limit: number = 20,
//   skip: number = 0,
// ) => {
//   const query: any = { conversationId };
//   if (searchText) query.body = { $regex: searchText, $options: 'i' };

//   return await MessageModel.find(query)
//     .sort({ timestamp: -1 })
//     .skip(skip)
//     .limit(limit);
// };

// export const markAsRead = async (messageId: string) => {
//   return await MessageModel.findByIdAndUpdate(
//     messageId,
//     { read: true },
//     { new: true },
//   );
// };

// // Incoming message handler
// export const handleIncomingMessage = async (data: any) => {
//   const { From, To, Body, NumMedia } = data;

//   const mediaUrls = [];
//   for (let i = 0; i < Number(NumMedia); i++) {
//     mediaUrls.push(data[`MediaUrl${i}`]);
//   }

//   const conversationId = From > To ? `${To}-${From}` : `${From}-${To}`;

//   // ক্লায়েন্ট API তে ইনকামিং মেসেজ পাঠানো
//   await axios.post(
//     CLIENT_API_URL,
//     {
//       request: 'SMS Message',
//       message_sid: data.MessageSid,
//       agent: To, // টুইলিওর নম্বর হতে পারে, অথবা যেটা Agent নম্বর
//       customer: From,
//       direction: 'In',
//       message: Body,
//       run_ai: true, // চাইলে false
//     },
//     {
//       headers: { 'Content-Type': 'application/json' },
//     },
//   );

//   // ইনকামিং মেসেজ ডাটাবেজে সেভ করা
//   return await MessageModel.create({
//     conversationId,
//     from: From,
//     to: To,
//     body: Body,
//     mediaUrls,
//     direction: 'inbound',
//     read: false,
//     timestamp: new Date(),
//   });
// };
import Twilio from 'twilio';
import MessageModel from '../models/message.model';
import axios from 'axios';

const CLIENT_API_URL =
  'https://prod-54.westus.logic.azure.com:443/workflows/4bd824b90c604ef1958c438f61c4dfc5/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=TDNg2ZCfMjYFNtvyZartu9BBAwAUzcuqacwyRkHJVHE';

export const sendMessage = async (
  twilioSid: string,
  twilioToken: string,
  fromNumber: string,
  toNumber: string,
  body: string,
  mediaUrls: string[] = [],
) => {
  const client = Twilio(twilioSid, twilioToken);
  const msgOptions: any = { body, from: fromNumber, to: toNumber };

  if (mediaUrls.length > 0) {
    msgOptions.mediaUrl = mediaUrls;
  }

  try {
    // Twilio থেকে মেসেজ তৈরি করা
    const message = await client.messages.create(msgOptions);

    // Conversation ID ফর্ম্যাট — দুই নম্বর sort করে হ্যান্ডেল করা
    const conversationId = [fromNumber, toNumber].sort().join('-');

    // ক্লায়েন্ট API তে মেসেজ পাঠানো
    const payload = {
      request: 'SMS Message',
      message_sid: message.sid,
      agent: fromNumber,
      customer: toNumber,
      direction: 'Out',
      message: body,
      run_ai: true,
    };
    await axios.post(CLIENT_API_URL, payload, {
      headers: { 'Content-Type': 'application/json' },
    });

    // মেসেজটি ডাটাবেজে সেভ করা
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

export const fetchMessages = async (
  conversationId: string,
  searchText: string = '',
  limit: number = 20,
  skip: number = 0,
) => {
  const query: any = { conversationId };
  if (searchText) query.body = { $regex: searchText, $options: 'i' };

  return await MessageModel.find(query)
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit);
};

export const markAsRead = async (messageId: string) => {
  return await MessageModel.findByIdAndUpdate(
    messageId,
    { read: true },
    { new: true },
  );
};

// Incoming message handler
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

    // ক্লায়েন্ট API তে ইনকামিং মেসেজ পাঠানো
    const payload = {
      request: 'SMS Message',
      message_sid: MessageSid,
      agent: To,
      customer: From,
      direction: 'In',
      message: Body,
      run_ai: true,
    };

    await axios.post(CLIENT_API_URL, payload, {
      headers: { 'Content-Type': 'application/json' },
    });

    // ইনকামিং মেসেজ ডাটাবেজে সেভ করা
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
