import Twilio from 'twilio';

const startCall = async (
  to: string,
  userTwilioSid: string,
  userTwilioToken: string,
  userTwilioPhone: string,
  twimlUrl: string,
  statusCallbackUrl: string,
) => {
  if (!to.startsWith('+')) throw new Error('Invalid "to" phone number format');
  if (!userTwilioPhone.startsWith('+'))
    throw new Error('Invalid "from" phone number format');

  const client = Twilio(userTwilioSid, userTwilioToken);
  console.log('TwimUrl = ' + twimlUrl);
  // Bidirectional call - use the provided TwiML URL for call instructions
  const call = await client.calls.create({
    to,
    from: userTwilioPhone,
    url: twimlUrl, // TwiML with <Dial> for two-way audio
    statusCallback: statusCallbackUrl,
    statusCallbackMethod: 'POST',
    statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
    record: false, // or true if recording required
  });

  return call;
};

export { startCall };
