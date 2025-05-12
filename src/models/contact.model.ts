import { Schema, model } from 'mongoose';

const contactSchema = new Schema({
  name: String,
  phoneNumber: String,
});

export default model('Contact', contactSchema);
