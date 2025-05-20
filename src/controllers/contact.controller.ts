// import { Request, Response } from 'express';
// import axios from 'axios';
// import Contact from '../models/contact.model';

// export const syncContacts = async (req: Request, res: Response) => {
//   const agent = req.query.agent as string;
//   console.log('Agent from query:', agent);

//   if (!agent || !agent.startsWith('+')) {
//     return res.status(400).json({
//       status: 'failed',
//       message:
//         '`agent` query parameter with a valid phone number starting with + is required',
//     });
//   }

//   try {
//     const crmUrl = process.env.GET_CONTACTS_URL as string;

//     // CRM API GET request with agent phone number
//     const response = await axios.get(crmUrl, {
//       params: { agent },
//     });

//     const data = response.data;

//     if (data.status !== 'success' || !Array.isArray(data.data)) {
//       return res.status(400).json({
//         status: 'failed',
//         message: 'Phone number not found or data structure wrong.',
//       });
//     }

//     // Optional: Delete old contacts before saving new ones
//     await Contact.deleteMany({});

//     // Save contacts to MongoDB
//     const savedContacts = await Contact.insertMany(data.data);

//     res.status(200).json({
//       status: 'success',
//       message: 'Contacts retrieved successfully and saved to DB',
//       data: savedContacts,
//     });
//   } catch (error: any) {
//     console.error(
//       'Error syncing contacts:',
//       error.response?.data || error.message,
//     );
//     res.status(500).json({
//       status: 'failed',
//       message: 'Failed to sync contacts',
//       error: error.response?.data || error.message,
//     });
//   }
// };
// import { Request, Response } from 'express';
// import axios from 'axios';
// import Contact from '../models/contact.model';

// export const syncContacts = async (req: Request, res: Response) => {
//   const agent = req.query.agent as string;

//   if (!agent || !agent.startsWith('+')) {
//     return res.status(400).json({
//       status: 'failed',
//       message:
//         '`agent` query parameter with a valid phone number starting with + is required',
//     });
//   }

//   try {
//     const crmUrl = process.env.GET_CONTACTS_URL as string;

//     const response = await axios.get(crmUrl, {
//       params: {
//         agent,
//         'api-version': '2016-06-01',
//         sp: '/triggers/manual/run',
//         sv: '1.0',
//         sig: process.env.CRM_API_SIG,
//       },
//     });

//     const data = response.data;
//     console.log(data.data);

//     if (data.status !== 'success' || !Array.isArray(data.data)) {
//       return res.status(400).json({
//         status: 'failed',
//         message: 'Phone number not found or data structure wrong.',
//       });
//     }

//     await Contact.deleteMany({});
//     const savedContacts = await Contact.insertMany(data.data);

//     res.status(200).json({
//       status: 'success',
//       message: 'Contacts retrieved successfully and saved to DB',
//       data: savedContacts,
//     });
//   } catch (error: any) {
//     console.error(
//       'Error syncing contacts:',
//       error.response?.data || error.message,
//     );
//     res.status(500).json({
//       status: 'failed',
//       message: 'Failed to sync contacts',
//       error: error.response?.data || error.message,
//     });
//   }
// };

import { Request, Response } from 'express';
import axios from 'axios';
import Contact from '../models/contact.model';

// ১. কন্টাক্ট লিস্ট পেতে (agent ছাড়া)
export const getContactList = async (req: Request, res: Response) => {
  try {
    const crmUrl = process.env.GET_CONTACTS_URL as string;

    // agent প্যারামিটার না দিয়ে শুধু কন্টাক্ট লিস্ট আনা হচ্ছে
    const response = await axios.get(crmUrl, {
      params: {
        'api-version': '2016-06-01',
        sp: '/triggers/manual/run',
        sv: '1.0',
        sig: process.env.CRM_API_SIG,
      },
    });

    const data = response.data;

    if (data.status !== 'success' || !Array.isArray(data.data)) {
      return res.status(400).json({
        status: 'failed',
        message: 'Failed to retrieve contact list.',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Contact list retrieved successfully',
      data: data.data,
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'failed',
      message: 'Error fetching contact list',
      error: error.response?.data || error.message,
    });
  }
};

// ২. কন্টাক্ট লিস্ট আপডেট করতে (agent সহ)
export const updateContactList = async (req: Request, res: Response) => {
  const agent = req.query.agent as string;

  if (!agent || !agent.startsWith('+')) {
    return res.status(400).json({
      status: 'failed',
      message:
        '`agent` query parameter with a valid phone number starting with + is required',
    });
  }

  try {
    const crmUrl = process.env.GET_CONTACTS_URL as string;

    // agent সহ GET রিকোয়েস্ট পাঠানো হচ্ছে
    const response = await axios.get(crmUrl, {
      params: {
        'api-version': '2016-06-01',
        sp: '/triggers/manual/run',
        sv: '1.0',
        sig: process.env.CRM_API_SIG,
        agent,
      },
    });

    const data = response.data;

    if (data.status !== 'success' || !Array.isArray(data.data)) {
      return res.status(400).json({
        status: 'failed',
        message: 'Phone number not found or data structure wrong.',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Contact list updated successfully',
      data: data.data,
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'failed',
      message: 'Failed to update contact list',
      error: error.response?.data || error.message,
    });
  }
};
