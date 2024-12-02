import mongoose, { Schema, Document } from "mongoose";

export interface IBeneficiary extends Document {
     account_name: string;
     account_number: string;
     bank_name: string;
     alias: string;
     has_alias: boolean;
     user: mongoose.Types.ObjectId;
     created_at: Date;
     updated_at: Date;
}

const beneficiarySchema = new Schema<IBeneficiary>(
     {
          account_name: {
               type: String,
               required: true,
          },
          account_number: {
               type: String,
               required: true,
          },
          bank_name: {
               type: String,
               required: true,
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
          user: {
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
