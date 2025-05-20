import { Request, Response } from 'express';
import CallModel from '../models/call.model';
import { startCall } from '../services/twilio.service';
import UserModel from '../models/user.model';

export const initiateCall = async (req: Request, res: Response) => {
  const {
    toNumber,
    clientId,
    customerFullName,
    customerCompanyName,
    direction = 'In',
    callStartTime,
    transcribeCall = true,
  } = req.body;

  try {
    const user = req.user as any;
    const dbUser = await UserModel.findById(user.userId);
    if (!dbUser) throw new Error('User not found');

    const call = await startCall(
      toNumber,
      dbUser.twilioSid,
      dbUser.twilioToken,
      dbUser.twilioPhoneNumber,
    );

    await CallModel.create({
      call_sid: call.sid,
      agent_phone: dbUser.twilioPhoneNumber,
      client_id: clientId,
      customer_phone: toNumber,
      customer_full_name: customerFullName,
      customer_company_name: customerCompanyName || '',
      direction,
      call_start_time: callStartTime ? new Date(callStartTime) : new Date(),
      transcribe_call: transcribeCall,
    });

    res.status(200).json({ message: 'Call initiated', callSid: call.sid });
  } catch (error: any) {
    console.error('Error initiating call:', error.message);
    res
      .status(500)
      .json({ error: 'Failed to start call', details: error.message });
  }
};

// Update Call Status (Call Ended or Notes)
export const updateCallStatus = async (req: Request, res: Response) => {
  const {
    request,
    call_sid,
    customer_full_name,
    customer_company_name,
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
    // Update local DB record if exists
    const call = await CallModel.findOne({ call_sid });

    if (call) {
      if (request === 'Call Ended') {
        call.call_end_time = call_end_time
          ? new Date(call_end_time)
          : new Date();
        call.notes = notes || call.notes;
        call.quality_of_call = quality_of_call ?? call.quality_of_call;
        call.call_duration = call_duration ?? call.call_duration;
        call.recording_url = recording_url || call.recording_url;
        call.transcribe_call = transcribe_call ?? call.transcribe_call;
      } else if (request === 'Call Notes') {
        call.notes = notes || call.notes;
        call.quality_of_call = quality_of_call ?? call.quality_of_call;
        call.follow_up_type = follow_up_type || call.follow_up_type;
        call.follow_up_subject = follow_up_subject || call.follow_up_subject;
        call.schedule_follow_up = schedule_follow_up
          ? new Date(schedule_follow_up)
          : call.schedule_follow_up;
        call.add_to_campaign = add_to_campaign || call.add_to_campaign;
        call.call_outcome = call_outcome || call.call_outcome;
      }
      await call.save();
    }

    // Notify CRM API for Call Ended or Call Notes
    await axios.post(twilioConfig.postUrl, req.body);

    res.status(200).json({
      status: 200,
      message: 'Call data successfully updated',
      request,
      call_sid,
    });
  } catch (error: any) {
    console.error(
      'Error updating call status:',
      error.response?.data || error.message,
    );
    res.status(400).json({
      status: 400,
      message: 'Call data structure was not correct',
      request: req.body.request,
      call_sid: req.body.call_sid,
    });
  }
};

// Sync Contacts (GET request with query param agent=phone_number)
export const syncContacts = async (req: Request, res: Response) => {
  const agent = req.query.agent as string;

  if (!agent) {
    return res
      .status(400)
      .json({ status: 'failed', message: 'Agent phone number is required' });
  }

  try {
    const response = await axios.get(twilioConfig.getUrl, {
      params: { agent },
    });

    res.status(200).json(response.data);
  } catch (error: any) {
    console.error(
      'Error syncing contacts:',
      error.response?.data || error.message,
    );
    res
      .status(400)
      .json({ status: 'failed', message: 'Failed to sync contacts' });
  }
};
