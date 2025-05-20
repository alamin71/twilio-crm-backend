import express from 'express';
import {
  getContactList,
  updateContactList,
} from '../controllers/contact.controller';

const router = express.Router();

router.get('/list', getContactList);
router.get('/update', updateContactList);

export default router;
