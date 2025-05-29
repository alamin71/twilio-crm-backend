import UserModel from '../models/user.model';
import { validateTwilioCredentials } from './twilio.service';
import { generateJWT } from '../utils/jwt.utils';
import Twilio from 'twilio';

export const loginUser = async (sid: string, token: string) => {
  let user = await UserModel.findOne({ twilioSid: sid });

  if (user) {
    if (user.twilioToken !== token) {
      throw new Error('Invalid Twilio Token');
    }
  } else {
    const isValid = await validateTwilioCredentials(sid, token);
    if (!isValid) {
      throw new Error('Invalid Twilio Credentials');
    }

    // ✅ Twilio Client দিয়ে নাম্বার সংগ্রহ
    const client = Twilio(sid, token);
    const numbers = await client.incomingPhoneNumbers.list();
    if (!numbers.length) {
      throw new Error('No Twilio phone number found');
    }
    const phoneNumber = numbers[0].phoneNumber;

    user = new UserModel({
      twilioSid: sid,
      twilioToken: token,
      twilioPhoneNumber: phoneNumber,
    });
    await user.save();
  }

  const jwtToken = generateJWT({ userId: user._id, twilioSid: user.twilioSid });
  return jwtToken;
};
