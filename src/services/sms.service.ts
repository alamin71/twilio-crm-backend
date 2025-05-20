import Twilio from 'twilio';
import MessageModel from '../models/message.model';

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

  const message = await client.messages.create(msgOptions);

  const conversationId =
    toNumber > fromNumber
      ? `${fromNumber}-${toNumber}`
      : `${toNumber}-${fromNumber}`;

  return await MessageModel.create({
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

export const handleIncomingMessage = async (data: any) => {
  const { From, To, Body, NumMedia } = data;

  const mediaUrls = [];
  for (let i = 0; i < Number(NumMedia); i++) {
    mediaUrls.push(data[`MediaUrl${i}`]);
  }

  const conversationId = From > To ? `${To}-${From}` : `${From}-${To}`;

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
};
