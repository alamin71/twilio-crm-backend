import express from 'express';
import {
  getCallHistory,
  getCallStatus,
  getFullCallDetails,
  initiateCall,
  updateCallStatus,
  voiceHandler,
} from '../controllers/call.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { smsWebhookHandler } from '../controllers/sms.controller';

const router = express.Router();

router.post('/start', authenticateJWT, initiateCall);
router.post('/status', updateCallStatus);
router.post('/sms/webhook', smsWebhookHandler);
router.get('/voice', voiceHandler);
router.get('/status/:call_sid', getCallStatus);
router.get('/details/:call_sid', getFullCallDetails);
router.get('/history', getCallHistory);
export default router;
