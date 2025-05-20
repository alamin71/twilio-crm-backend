import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  twilioSid: string;
  twilioToken: string;
  twilioPhoneNumber: string;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  twilioSid: { type: String, required: true, unique: true },
  twilioToken: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  twilioPhoneNumber: { type: String, required: true },
});

export default mongoose.model<IUser>('User', UserSchema);
