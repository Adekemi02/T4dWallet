import mongoose, { Schema, Document } from "mongoose";

export interface IBeneficiary extends Document {
  wallet_name: string;
  wallet_id: string;
  bank_name: string;
  alias: string;
  has_alias: boolean;
  owner: mongoose.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

const beneficiarySchema = new Schema<IBeneficiary>(
  {
    wallet_name: {
      type: String,
      required: true,
    },
    wallet_id: {
      type: String,
      required: true,
    },
    bank_name: {
      type: String,
      required: false,
    },
    alias: {
      type: String,
      required: false,
    },
    has_alias: {
      type: Boolean,
      required: false,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export const Beneficiary = mongoose.model<IBeneficiary>(
  "Beneficiary",
  beneficiarySchema
);
