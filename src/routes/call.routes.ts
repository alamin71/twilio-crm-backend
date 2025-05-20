import express from 'express';
import {
  initiateCall,
  updateCallStatus,
  syncContacts,
} from '../controllers/call.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/start', authenticateJWT, initiateCall);
router.post('/status', updateCallStatus);
router.get('/contacts/sync', syncContacts);

export default router;
