// import express from 'express';
// import {
//   getCallHistory,
//   getCallStatus,
//   getFullCallDetails,
//   initiateCall,
//   updateCallStatus,
//   voiceHandler,
// } from '../controllers/call.controller';
// import { authenticateJWT } from '../middlewares/auth.middleware';
// import { smsWebhookHandler } from '../controllers/sms.controller';

// const router = express.Router();

// router.post('/start', authenticateJWT, initiateCall);
// router.post('/status', updateCallStatus);
// router.post('/sms/webhook', smsWebhookHandler);
// router.get('/voice', voiceHandler);
// router.get('/status/:call_sid', getCallStatus);
// router.get('/details/:call_sid', getFullCallDetails);
// router.get('/history', getCallHistory);
// export default router;
import express from 'express';
import {
  initiateCall,
  voiceHandler,
  updateCallStatus,
  getCallDetails,
} from '../controllers/call.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = express.Router();

// Start a call
router.post('/start', authenticateJWT, initiateCall);

// Twilio Voice webhook to provide TwiML for bidirectional calls
router.get('/voice', voiceHandler);

// Endpoint for client CRM webhook to update call status and notes
router.post('/status', updateCallStatus);

// Get call details by call_sid
router.get('/:call_sid', getCallDetails);

export default router;
