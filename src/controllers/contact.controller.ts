import { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import Contact from '../models/contact.model';

dotenv.config();

export const syncContacts = async (req: Request, res: Response) => {
  try {
    const crmUrl = process.env.GET_CONTACTS_URL as string;

    const response = await axios.get(crmUrl);

    const contacts = response.data;

    if (!Array.isArray(contacts)) {
      return res.status(400).json({ message: 'Invalid contacts format' });
    }

    // Optional: Clear old contacts
    await Contact.deleteMany({});

    // Save each contact to MongoDB
    const savedContacts = await Contact.insertMany(contacts);

    res.status(200).json({
      message: 'Contacts synced and saved to DB successfully',
      data: savedContacts,
    });
  } catch (error: any) {
    console.error('Error syncing contacts:', error.message);
    res.status(500).json({
      message: 'Failed to sync contacts',
      error: error.message,
    });
  }
};
