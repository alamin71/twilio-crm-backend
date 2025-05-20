import Twilio from 'twilio';

export const validateTwilioCredentials = async (
  sid: string,
  token: string,
): Promise<boolean> => {
  try {
    const client = Twilio(sid, token);
    await client.api.accounts(sid).fetch();
    return true;
  } catch {
    return false;
  }
};

export const startCall = async (
  to: string,
  userTwilioSid: string,
  userTwilioToken: string,
  userTwilioPhone: string,
) => {
  if (!to.startsWith('+')) throw new Error('Invalid "to" format');
  if (!userTwilioPhone.startsWith('+'))
    throw new Error('Invalid "from" format');

  const client = Twilio(userTwilioSid, userTwilioToken);
  const twimlUrl = 'http://demo.twilio.com/docs/voice.xml'; // অথবা তোমার TwiML URL

  const call = await client.calls.create({
    url: `${twimlUrl}?callStatus=ringing&to=${encodeURIComponent(to)}&from=${encodeURIComponent(userTwilioPhone)}`,
    to,
    from: userTwilioPhone,
    statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
    statusCallbackMethod: 'POST',
    record: true,
    transcribe: true,
  });

  return call;
};
