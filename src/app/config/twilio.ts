// import dotenv from 'dotenv';
// dotenv.config();

// const accountSid = process.env.TWILIO_SID as string;
// const authToken = process.env.TWILIO_TOKEN as string;

// export const twilioClient = new Twilio(accountSid, authToken);

// import dotenv from 'dotenv';
// dotenv.config();

// console.log('Loaded TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID);

// export const twilioConfig = {
//   accountSid: process.env.TWILIO_ACCOUNT_SID || '',
//   authToken: process.env.TWILIO_AUTH_TOKEN || '',
//   phoneNumber: process.env.TWILIO_PHONE_NUMBER || '',
//   postUrl: process.env.POST_CALL_STATUS_URL || '',
//   getUrl: process.env.GET_CONTACTS_URL || '',
// };
// import dotenv from 'dotenv';
// import Twilio from 'twilio';

// dotenv.config();

// console.log('Loaded TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID);
// console.log('Loaded TWILIO_AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN);
// console.log('Loaded TWILIO_PHONE_NUMBER:', process.env.TWILIO_PHONE_NUMBER);
// console.log('Loaded POST_CALL_STATUS_URL:', process.env.POST_CALL_STATUS_URL);
// console.log('Loaded GET_CONTACTS_URL:', process.env.GET_CONTACTS_URL);

// export const twilioConfig = {
//   accountSid: process.env.TWILIO_ACCOUNT_SID || '',
//   authToken: process.env.TWILIO_AUTH_TOKEN || '',
//   phoneNumber: process.env.TWILIO_PHONE_NUMBER || '',
//   postUrl: process.env.POST_CALL_STATUS_URL || '',
//   getUrl: process.env.GET_CONTACTS_URL || '',
// };

// export const twilioClient = Twilio(
//   twilioConfig.accountSid,
//   twilioConfig.authToken,
// );
import dotenv from 'dotenv';
import Twilio from 'twilio';

dotenv.config();

export const twilioConfig = {
  accountSid: process.env.TWILIO_ACCOUNT_SID || '',
  authToken: process.env.TWILIO_AUTH_TOKEN || '',
  phoneNumber: process.env.TWILIO_PHONE_NUMBER || '',
  postUrl: process.env.POST_CALL_STATUS_URL || '',
  getUrl: process.env.GET_CONTACTS_URL || '',
};

export const twilioClient = Twilio(
  twilioConfig.accountSid,
  twilioConfig.authToken,
);
