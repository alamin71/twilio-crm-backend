// import UserModel, { IUser } from '../models/user.model';
// import { validateTwilioCredentials } from './twilio.service';
// import { generateJWT } from '../utils/jwt.utils';

// export const loginUser = async (sid: string, token: string) => {
//   // ১. ডাটাবেজে খুঁজে দেখুন ইউজার আছে কিনা
//   let user = await UserModel.findOne({ twilioSid: sid });

//   if (user) {
//     // ইউজার পাওয়া গেলে টোকেন মিলিয়ে দেখুন
//     if (user.twilioToken !== token) {
//       throw new Error('Invalid Twilio Token');
//     }
//   } else {
//     // ইউজার না থাকলে Twilio API দিয়ে ভ্যালিডেশন
//     const isValid = await validateTwilioCredentials(sid, token);
//     if (!isValid) {
//       throw new Error('Invalid Twilio Credentials');
//     }
//     // ভ্যালিড হলে ডাটাবেজে নতুন ইউজার তৈরি করুন
//     user = new UserModel({ twilioSid: sid, twilioToken: token });
//     await user.save();
//   }

//   // JWT Token তৈরি করুন
//   const jwtToken = generateJWT({ userId: user._id, twilioSid: user.twilioSid });
//   return jwtToken;
// };

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
