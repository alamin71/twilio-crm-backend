// import mongoose, { Schema, Document } from 'mongoose';

// export interface ICall extends Document {
//   to: string;
//   from: string;
//   callStatus: string;
//   recordingUrl?: string;
//   callDuration?: number;
//   notes?: string;
//   qualityOfCall?: number;
//   dateAndTime?: Date;
//   scheduleFollowUp?: Date;
//   callOutcome?: string;
//   customerId?: string;
//   transcribeCall?: boolean;
//   followUpType?: string;
//   followUpSubject?: string;
// }

// const CallSchema: Schema = new Schema({
//   to: { type: String, required: true },
//   from: { type: String, required: true },
//   callStatus: { type: String, required: true },
//   recordingUrl: { type: String },
//   callDuration: { type: Number },
//   notes: { type: String },
//   qualityOfCall: { type: Number },
//   dateAndTime: { type: Date },
//   scheduleFollowUp: { type: Date },
//   callOutcome: { type: String },
//   customerId: { type: String },
//   transcribeCall: { type: Boolean },
//   followUpType: { type: String },
//   followUpSubject: { type: String },
// });

// export default mongoose.model<ICall>('Call', CallSchema);
import mongoose, { Schema, Document } from 'mongoose';

export interface ICall extends Document {
  call_sid: string;
  agent_phone: string;
  client_id?: string;
  customer_phone: string;
  customer_full_name: string;
  customer_company_name?: string;
  direction?: 'In' | 'Out';
  call_start_time?: Date;
  call_end_time?: Date;
  notes?: string;
  quality_of_call?: number;
  call_duration?: number;
  recording_url?: string;
  transcribe_call?: boolean;
  follow_up_type?: string;
  follow_up_subject?: string;
  schedule_follow_up?: Date;
  add_to_campaign?: string;
  call_outcome?: string;
}

const CallSchema: Schema = new Schema({
  call_sid: { type: String, required: true, unique: true },
  agent_phone: { type: String, required: true },
  client_id: { type: String },
  customer_phone: { type: String, required: true },
  customer_full_name: { type: String, required: true },
  customer_company_name: { type: String, default: '' },
  direction: { type: String, enum: ['In', 'Out'], default: 'In' },
  call_start_time: { type: Date },
  call_end_time: { type: Date },
  notes: { type: String, default: '' },
  quality_of_call: { type: Number, min: 1, max: 5 },
  call_duration: { type: Number },
  recording_url: { type: String, default: '' },
  transcribe_call: { type: Boolean, default: false },
  follow_up_type: {
    type: String,
    enum: ['appointment', 'call', 'email', 'sms'],
  },
  follow_up_subject: { type: String, default: '' },
  schedule_follow_up: { type: Date },
  add_to_campaign: { type: String, default: '' },
  call_outcome: { type: String, default: '' },
});

export default mongoose.model<ICall>('Call', CallSchema);
