import Twilio from 'twilio';

const startCall = async (
  to: string,
  userTwilioSid: string,
  userTwilioToken: string,
  userTwilioPhone: string,
  twimlUrl: string,
  statusCallbackUrl: string,
) => {
  if (!to.startsWith('+')) throw new Error('Invalid "to" format');
  if (!userTwilioPhone.startsWith('+'))
    throw new Error('Invalid "from" format');

  const client = Twilio(userTwilioSid, userTwilioToken);

  console.log(userTwilioSid);
  console.log(userTwilioToken);
  console.log(twimlUrl);

  const call = await client.calls.create({
    url: twimlUrl,
    to,
    from: userTwilioPhone,
    statusCallback: statusCallbackUrl,
    statusCallbackMethod: 'POST',
    statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
    record: false,
    // transcribe: true,
  });

  return call;
};

/**
 * Validates Twilio credentials by attempting to fetch the authenticated account.
 * @param accountSid Twilio Account SID
 * @param authToken Twilio Auth Token
 * @returns true if credentials are valid, false otherwise
 */
const validateTwilioCredentials = async (
  accountSid: string,
  authToken: string,
): Promise<boolean> => {
  try {
    const client = Twilio(accountSid, authToken);
    const account = await client.api.accounts(accountSid).fetch();

    // Optional: check if account is active
    return account.status === 'active';
  } catch (error: any) {
    console.error('Invalid Twilio credentials:', error.message);
    return false;
  }
};

export { startCall, validateTwilioCredentials };
