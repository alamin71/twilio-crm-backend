import { Twilio } from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

const accountSid = process.env.TWILIO_SID as string;
const authToken = process.env.TWILIO_TOKEN as string;

export const twilioClient = new Twilio(accountSid, authToken);
