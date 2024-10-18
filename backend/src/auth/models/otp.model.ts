import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IOtp extends Document {
  userId: Types.ObjectId;
  code: string;
  expires_at: Date;
  failed_attempts?: number;
  created_at: Date;
  updated_at: Date;
}

const otpSchema = new Schema<IOtp>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  code: {
    type: String,
    required: true,
  },
  expires_at: {
    type: Date,
    required: true,
  },
  failed_attempts: {
    type: Number,
    default: 0,
  },

  created_at: {
    type: Date,
    required: false,
    default: Date.now(),
    expires: 1800
 },

 updated_at: {
    type: Date,
    required: false,
    default: Date.now(),
 }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

export const OTP = mongoose.model<IOtp>('Otp', otpSchema);
