import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
  full_name?: string;
  company_name?: string;
  phone_number: string;
  qued?: boolean;
  qued_date?: string;
}

const ContactSchema: Schema = new Schema({
  full_name: { type: String, required: false, default: 'Unknown' },
  first_name: { type: String, required: false, default: 'Unknown' },
  company_name: { type: String, default: '' },
  phone_number: { type: String, required: true, unique: true },
  qued: { type: Boolean, required: false, default: false },
  qued_date: { type: String, default: '' },
});

export default mongoose.model<IContact>('Contact', ContactSchema);
