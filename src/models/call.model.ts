import { Schema, model } from 'mongoose';

const callSchema = new Schema(
  {
    contactName: { type: String },
    phoneNumber: { type: String },
    status: {
      type: String,
      enum: ['Ringing', 'In Progress', 'Completed', 'Failed'],
    },
    duration: { type: Number }, // in seconds
    startTime: { type: Date },
    endTime: { type: Date },
    notes: { type: String },
    outcome: { type: String }, // like "Successful", "No answer", etc.
    quality: { type: String }, // like "Good", "Poor"
    transcribedText: { type: String },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  },
);

export default model('Call', callSchema);
