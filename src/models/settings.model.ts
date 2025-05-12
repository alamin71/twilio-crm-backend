import { Schema, model } from 'mongoose';

const settingsSchema = new Schema({
  twilioSid: String,
  twilioToken: String,
  getUrl: String,
  postUrl: String,
  selectedPhoneNumber: String,
  recordCalls: Boolean,
  textAiEnabled: Boolean,
});

export default model('Settings', settingsSchema);
