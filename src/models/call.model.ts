// import mongoose, { Document, Schema } from 'mongoose';

// interface ICall extends Document {
//   call_sid: string;
//   agent_phone: string;
//   guid: string;
//   customer_phone: string;
//   customer_full_name: string;
//   customer_company_name: string;
//   direction: string;
//   call_start_time: Date;
//   notes: string;
//   recording_url: string;
//   transcribe_call: boolean;
//   follow_up_subject: string;
//   add_to_campaign: string;
//   call_outcome: string;
//   call_duration: string;
// }

// const callSchema = new Schema<ICall>({
//   call_sid: { type: String, required: true, unique: true }, // Unique index set here
//   agent_phone: { type: String, required: true },
//   guid: { type: String, required: false },
//   customer_phone: { type: String, required: true },
//   customer_full_name: { type: String, required: false },
//   customer_company_name: { type: String, default: '' },
//   direction: { type: String, required: true },
//   call_start_time: { type: Date, required: true },
//   notes: { type: String, default: 'This is test' },
//   recording_url: { type: String, default: '' },
//   transcribe_call: { type: Boolean, default: false },
//   follow_up_subject: { type: String, default: '' },
//   add_to_campaign: { type: String, default: '' },
//   call_outcome: { type: String, default: '' },
//   call_duration: { type: String, default: '2:30' },
// });

// const CallModel = mongoose.model<ICall>('Call', callSchema);

// export default CallModel;
import mongoose, { Document, Schema } from 'mongoose';

export interface ICall extends Document {
  call_sid: string;
  agent_phone: string;
  guid?: string;
  customer_phone: string;
  customer_full_name: string;
  customer_company_name: string;
  direction: 'In' | 'Out' | string;
  call_start_time: Date;
  call_end_time?: Date;
  notes?: string;
  recording_url?: string;
  transcribe_call: boolean;
  follow_up_type?: string;
  follow_up_subject?: string;
  add_to_campaign?: string;
  call_outcome?: string;
  quality_of_call?: number;
  call_duration?: number; // in minutes
  call_status?: 'started' | 'completed' | 'ended' | string;
  schedule_follow_up?: Date;
}

const callSchema = new Schema<ICall>({
  call_sid: { type: String, required: true, unique: true },
  agent_phone: { type: String, required: true },
  guid: { type: String },
  customer_phone: { type: String, required: true },
  customer_full_name: { type: String, default: '400 - New Contact' },
  customer_company_name: { type: String, default: '' },
  direction: { type: String, required: true },
  call_start_time: { type: Date, required: true },
  call_end_time: { type: Date },
  notes: { type: String, default: '' },
  recording_url: { type: String, default: '' },
  transcribe_call: { type: Boolean, default: false },
  follow_up_type: { type: String, default: '' },
  follow_up_subject: { type: String, default: '' },
  add_to_campaign: { type: String, default: '' },
  call_outcome: { type: String, default: '' },
  quality_of_call: { type: Number, min: 1, max: 5 },
  call_duration: { type: Number, default: 0 },
  call_status: { type: String, default: 'started' },
  schedule_follow_up: { type: Date },
});

const CallModel = mongoose.model<ICall>('Call', callSchema);
export default CallModel;
