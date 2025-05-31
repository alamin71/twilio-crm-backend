// import { Request, Response } from 'express';
// import CallModel from '../models/call.model';
// import { startCall } from '../services/twilio.service';
// import UserModel from '../models/user.model';
// import twilio from 'twilio';

// export const initiateCall = async (req: Request, res: Response) => {
//   try {
//     const {
//       toNumber,
//       guid,
//       customerFullName,
//       customerCompanyName,
//       direction = 'Out',
//       callStartTime,
//       transcribeCall = true,
//     } = req.body;

//     const user = req.user as any;
//     if (!user || !user.userId) {
//       return res.status(401).json({ error: 'Unauthorized: User not found' });
//     }

//     const dbUser = await UserModel.findById(user.userId);
//     if (!dbUser) return res.status(404).json({ error: 'User not found' });

//     const voiceWebhookUrl = `${process.env.PUBLIC_VOICE_URL}?to=${encodeURIComponent(toNumber)}`;
//     console.log(voiceWebhookUrl);

//     const call = await startCall(
//       toNumber,
//       dbUser.twilioSid,
//       dbUser.twilioToken,
//       dbUser.twilioPhoneNumber,
//       voiceWebhookUrl,
//       `${process.env.PUBLIC_API_URL}/api/call/status`, // statusCallback URL
//     );

//     await CallModel.create({
//       call_sid: call.sid,
//       agent_phone: dbUser.twilioPhoneNumber,
//       guid,
//       customer_phone: toNumber,
//       customer_full_name: customerFullName,
//       customer_company_name: customerCompanyName || '',
//       direction,
//       call_start_time: callStartTime ? new Date(callStartTime) : new Date(),
//       transcribe_call: transcribeCall,
//     });

//     res.status(200).json({ message: 'Call initiated', callSid: call.sid });
//   } catch (error: any) {
//     console.error('Error initiating call:', error.message);
//     res
//       .status(500)
//       .json({ error: 'Failed to start call', details: error.message });
//   }
// };

// export const voiceHandler = (req: Request, res: Response) => {
//   let to = req.query.to as string;
//   if (to) {
//     to = to.replace(/\s+/g, '');
//     if (!to.startsWith('+')) {
//       to = '+' + to;
//     }
//   }

//   const callerId =
//     (req.query.callerId as string) || process.env.TWILIO_PHONE_NUMBER;
//   console.log('---- voiceHandler called ----');
//   console.log('Received "to" parameter:', to);
//   console.log('Using callerId:', callerId);

//   const twiml = new twilio.twiml.VoiceResponse();
//   console.log(twiml.toString());
//   twiml.say('Hello! Your server is working. This is a test call.');
//   if (to && to.startsWith('+')) {
//     const dial = twiml.dial({ callerId: process.env.TWILIO_PHONE_NUMBER });
//     dial.number(to);
//   } else {
//     twiml.say('Thanks for calling. No valid number provided.');
//   }

//   res.type('text/xml');
//   res.send(twiml.toString());
// };

// export const updateCallStatus = async (req: Request, res: Response) => {
//   const {
//     request, // Call Started, Call Ended, Call Notes
//     call_sid, // Call SID from Twilio
//     customer_full_name,
//     customer_company_name,
//     call_end_time,
//     notes,
//     quality_of_call,
//     call_duration,
//     recording_url,
//     transcribe_call,
//     follow_up_type,
//     follow_up_subject,
//     schedule_follow_up,
//     add_to_campaign,
//     call_outcome,
//     call_start_time,
//   } = req.body;

//   try {
//     const call = await CallModel.findOne({ call_sid: { $eq: call_sid } }); // Case insensitive query check

//     if (call) {
//       const updatedFields: any = {};

//       if (request === 'Call Started') {
//         // Updating call start time
//         call.call_start_time = call_start_time
//           ? new Date(call_start_time)
//           : new Date();
//         updatedFields.call_start_time = call.call_start_time;
//       } else if (request === 'Call Ended') {
//         // Updating call end time, duration, notes, etc.
//         call.call_end_time = call_end_time
//           ? new Date(call_end_time)
//           : new Date();
//         updatedFields.call_end_time = call.call_end_time;

//         if (call_duration) {
//           call.call_duration = parseInt(call_duration, 10);
//           updatedFields.call_duration = call.call_duration;
//         }

//         if (recording_url) {
//           call.recording_url = recording_url;
//           updatedFields.recording_url = recording_url;
//         }

//         if (notes) {
//           call.notes = notes;
//           updatedFields.notes = notes;
//         }

//         if (quality_of_call) {
//           call.quality_of_call = quality_of_call;
//           updatedFields.quality_of_call = quality_of_call;
//         }

//         call.call_status = 'completed';
//         updatedFields.call_status = 'completed';
//       } else if (request === 'Call Notes') {
//         // Updating notes and follow-up info
//         if (notes) {
//           call.notes = notes;
//           updatedFields.notes = notes;
//         }

//         if (quality_of_call) {
//           call.quality_of_call = quality_of_call;
//           updatedFields.quality_of_call = quality_of_call;
//         }

//         if (follow_up_type) {
//           call.follow_up_type = follow_up_type;
//           updatedFields.follow_up_type = follow_up_type;
//         }

//         if (follow_up_subject) {
//           call.follow_up_subject = follow_up_subject;
//           updatedFields.follow_up_subject = follow_up_subject;
//         }

//         if (schedule_follow_up) {
//           call.schedule_follow_up = new Date(schedule_follow_up);
//           updatedFields.schedule_follow_up = call.schedule_follow_up;
//         }

//         if (add_to_campaign) {
//           call.add_to_campaign = add_to_campaign;
//           updatedFields.add_to_campaign = add_to_campaign;
//         }

//         if (call_outcome) {
//           call.call_outcome = call_outcome;
//           updatedFields.call_outcome = call_outcome;
//         }
//       }

//       await call.save();

//       res.status(200).json({
//         status: 200,
//         message: 'Call data successfully updated',
//         request,
//         call_sid,
//         updatedFields,
//       });
//     } else {
//       res.status(404).json({
//         status: 404,
//         message: 'Call not found',
//         call_sid,
//       });
//     }
//   } catch (error: any) {
//     console.error('Error updating call status:', error);
//     res.status(500).json({
//       status: 500,
//       message: 'Internal Server Error',
//       error: error.message || error,
//     });
//   }
// };

// // Example Express API to fetch call info by call_sid
// import { Request, Response } from 'express';

// export const getCallStatus = async (req: Request, res: Response) => {
//   try {
//     const { call_sid } = req.params;

//     const call = await CallModel.findOne({ call_sid });

//     if (!call) {
//       return res.status(404).json({ message: 'Call not found' });
//     }

//     res.status(200).json({
//       call_sid: call.call_sid,
//       call_start_time: call.call_start_time,
//       call_end_time: call.call_end_time,
//       call_status: call.call_status || 'Started',
//       customer_full_name: call.customer_full_name,
//       notes: call.notes,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// export const getFullCallDetails = async (req: Request, res: Response) => {
//   try {
//     const { call_sid } = req.params;

//     const call = await CallModel.findOne({ call_sid });

//     if (!call) {
//       return res.status(404).json({ message: 'Call not found' });
//     }

//     // return from db history
//     res.status(200).json({
//       call_sid: call.call_sid,
//       agent_phone: call.agent_phone,
//       guid: call.guid,
//       customer_phone: call.customer_phone,
//       customer_full_name: call.customer_full_name,
//       customer_company_name: call.customer_company_name,
//       direction: call.direction,
//       call_start_time: call.call_start_time,
//       call_end_time: call.call_end_time,
//       notes: call.notes,
//       recording_url: call.recording_url,
//       transcribe_call: call.transcribe_call,
//       follow_up_subject: call.follow_up_subject,
//       add_to_campaign: call.add_to_campaign,
//       call_outcome: call.call_outcome,
//       quality_of_call: call.quality_of_call,
//       call_duration: call.call_duration,
//       follow_up_type: call.follow_up_type,
//       follow_up_subject: call.follow_up_subject,
//       schedule_follow_up: call.schedule_follow_up,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // call history return function
// export const getCallHistory = async (req: Request, res: Response) => {
//   try {
//     // Optional: filter by agent_phone
//     const agentPhone = req.query.agent_phone as string | undefined;

//     let filter = {};
//     if (agentPhone) {
//       filter = { agent_phone: agentPhone };
//     }

//     // database thke filter kore call list get kora jabe and new call age thakbe
//     const calls = await CallModel.find(filter).sort({ call_start_time: -1 });

//     res.status(200).json(calls);
//   } catch (error) {
//     console.error('Error fetching call history:', error);
//     res.status(500).json({ message: 'Server error fetching call history' });
//   }
// };

import { Request, Response } from 'express';
import CallModel from '../models/call.model';
import { startCall } from '../services/twilio.service';
import UserModel from '../models/user.model';
import twilio from 'twilio';
import axios from 'axios';

export const initiateCall = async (req: Request, res: Response) => {
  try {
    const {
      toNumber,
      guid,
      customerFullName,
      customerCompanyName,
      direction = 'Out',
      callStartTime,
      transcribeCall = false,
    } = req.body;

    const user = req.user as any;
    if (!user || !user.userId) {
      return res.status(401).json({ error: 'Unauthorized: User not found' });
    }

    const dbUser = await UserModel.findById(user.userId);
    if (!dbUser) return res.status(404).json({ error: 'User not found' });

    const voiceWebhookUrl = `${process.env.PUBLIC_VOICE_URL}?to=${encodeURIComponent(toNumber)}`;
    const statusCallbackUrl = `${process.env.PUBLIC_API_URL}/api/call/status`;

    const call = await startCall(
      toNumber,
      dbUser.twilioSid,
      dbUser.twilioToken,
      dbUser.twilioPhoneNumber,
      voiceWebhookUrl,
      statusCallbackUrl,
    );

    await CallModel.create({
      call_sid: call.sid,
      agent_phone: dbUser.twilioPhoneNumber,
      guid,
      customer_phone: toNumber,
      customer_full_name: customerFullName || '400 - New Contact',
      customer_company_name: customerCompanyName || '',
      direction,
      call_start_time: callStartTime ? new Date(callStartTime) : new Date(),
      transcribe_call: transcribeCall,
      call_status: 'started',
    });

    return res.status(200).json({
      status: 'success',
      message: 'Call initiated',
      call_sid: call.sid,
    });
  } catch (error: any) {
    console.error('Error initiating call:', error);
    return res.status(500).json({
      status: 'failed',
      message: error.message || 'Failed to initiate call',
    });
  }
};

// Twilio Voice webhook handler
import { Request, Response } from 'express';
import twilio from 'twilio';

export const voiceHandler = (req: Request, res: Response) => {
  let to = req.query.to as string | undefined;
  console.log('--- Voice webhook called ---');
  console.log('Raw "to" param:', to);

  if (!to) {
    console.error('Error: "to" parameter is missing.');
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say('No number provided to dial.');
    res.type('text/xml').send(twiml.toString());
    return;
  }

  to = to.trim();
  if (!to.startsWith('+')) {
    to = '+' + to;
  }
  console.log('Processed "to" number:', to);

  const callerId = process.env.TWILIO_PHONE_NUMBER || '';
  console.log('Using callerId:', callerId);

  const twiml = new twilio.twiml.VoiceResponse();

  try {
    const dial = twiml.dial({ callerId });
    dial.number(to);
    const twimlString = twiml.toString();

    console.log('Generated TwiML:');
    console.log(twimlString);

    res.type('text/xml').send(twimlString);
  } catch (error) {
    console.error('Error generating TwiML:', error);
    const twimlErr = new twilio.twiml.VoiceResponse();
    twimlErr.say('An error occurred while processing the call.');
    res.type('text/xml').status(500).send(twimlErr.toString());
  }
};

// Update Call Status (Start, End, Notes)
export const updateCallStatus = async (req: Request, res: Response) => {
  const {
    request,
    call_sid,
    customer_full_name,
    customer_company_name,
    call_start_time,
    call_end_time,
    notes,
    quality_of_call,
    call_duration,
    recording_url,
    transcribe_call,
    follow_up_type,
    follow_up_subject,
    schedule_follow_up,
    add_to_campaign,
    call_outcome,
  } = req.body;

  try {
    if (!call_sid) {
      return res
        .status(400)
        .json({ status: 'failed', message: 'call_sid is required' });
    }

    const call = await CallModel.findOne({ call_sid });

    if (!call) {
      return res
        .status(404)
        .json({ status: 'failed', message: 'Call not found', call_sid });
    }

    switch (request) {
      case 'Call Started':
        call.call_start_time = call_start_time
          ? new Date(call_start_time)
          : new Date();
        call.call_status = 'started';
        break;

      case 'Call Ended':
        call.call_end_time = call_end_time
          ? new Date(call_end_time)
          : new Date();
        if (call_duration !== undefined)
          call.call_duration = Number(call_duration);
        if (notes !== undefined) call.notes = notes;
        if (quality_of_call !== undefined)
          call.quality_of_call = Number(quality_of_call);
        if (recording_url !== undefined) call.recording_url = recording_url;
        if (transcribe_call !== undefined)
          call.transcribe_call = Boolean(transcribe_call);
        call.call_status = 'completed';
        break;

      case 'Call Notes':
        if (notes !== undefined) call.notes = notes;
        if (quality_of_call !== undefined)
          call.quality_of_call = Number(quality_of_call);
        if (follow_up_type !== undefined) call.follow_up_type = follow_up_type;
        if (follow_up_subject !== undefined)
          call.follow_up_subject = follow_up_subject;
        if (schedule_follow_up !== undefined)
          call.schedule_follow_up = new Date(schedule_follow_up);
        if (add_to_campaign !== undefined)
          call.add_to_campaign = add_to_campaign;
        if (call_outcome !== undefined) call.call_outcome = call_outcome;
        break;

      default:
        return res
          .status(400)
          .json({ status: 'failed', message: 'Invalid request type', request });
    }

    if (customer_full_name !== undefined)
      call.customer_full_name = customer_full_name;
    if (customer_company_name !== undefined)
      call.customer_company_name = customer_company_name;

    await call.save();

    // Client API te POST pathano
    const clientApiUrl =
      'https://prod-101.westus.logic.azure.com:443/workflows/77a4147023104f62a7ebea57257671da/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=TUmAoYl0oBf0dQP-RbUulSBOo92U9jcvfjH4hMZ6DPI';

    const clientPayload: any = {
      request,
      call_sid,
      customer_full_name: call.customer_full_name,
      customer_company_name: call.customer_company_name,
    };

    if (request === 'Call Started') {
      clientPayload.agent_phone = call.agent_phone;
      clientPayload.client_id = call.guid || '';
      clientPayload.customer_phone = call.customer_phone;
      clientPayload.direction = call.direction;
      clientPayload.call_start_time = call.call_start_time.toISOString();
    } else if (request === 'Call Ended') {
      clientPayload.call_end_time =
        call.call_end_time?.toISOString() || new Date().toISOString();
      clientPayload.notes = call.notes;
      clientPayload.quality_of_call = call.quality_of_call || 1;
      clientPayload.call_duration = call.call_duration || 0;
      clientPayload.recording_url = call.recording_url || '';
      clientPayload.transcribe_call = call.transcribe_call;
    } else if (request === 'Call Notes') {
      clientPayload.notes = call.notes;
      clientPayload.quality_of_call = call.quality_of_call || 1;
      clientPayload.follow_up_type = call.follow_up_type || '';
      clientPayload.follow_up_subject = call.follow_up_subject || '';
      clientPayload.schedule_follow_up = call.schedule_follow_up
        ? call.schedule_follow_up.toISOString()
        : '';
      clientPayload.add_to_campaign = call.add_to_campaign || '';
      clientPayload.call_outcome = call.call_outcome || '';
    }

    // axios import kora ache upore
    await axios.post(clientApiUrl, clientPayload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 5000,
    });

    res.status(200).json({
      status: 'success',
      message: 'Call data successfully updated and sent to client API',
      request,
      call_sid,
    });
  } catch (error: any) {
    console.error('Error updating call status:', error);
    res.status(500).json({
      status: 'failed',
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Get full call details by call_sid
export const getCallDetails = async (req: Request, res: Response) => {
  try {
    const { call_sid } = req.params;
    if (!call_sid)
      return res.status(400).json({ message: 'call_sid param required' });

    const call = await CallModel.findOne({ call_sid });
    if (!call) return res.status(404).json({ message: 'Call not found' });

    return res.status(200).json(call);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};
