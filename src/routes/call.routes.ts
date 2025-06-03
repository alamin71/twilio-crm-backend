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
