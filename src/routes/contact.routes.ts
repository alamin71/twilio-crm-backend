import express from 'express';
import { syncContacts } from '../controllers/contact.controller';

const router = express.Router();

router.get('/sync', syncContacts);

export default router;
