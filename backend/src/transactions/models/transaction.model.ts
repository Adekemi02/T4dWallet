import mongoose, { Schema, Document, Types } from "mongoose";
import {
  TransactionCategory,
  TransactionStatus,
} from "../interfaces/transaction.interface";

export interface ITransaction extends Document {
  transaction_type: "CREDIT" | "DEBIT";
  amount: number;
  transaction_category: TransactionCategory;
  transaction_status: TransactionStatus;
  balance_before: Types.Decimal128;
  balance_after: Types.Decimal128;
  charge: number;
  currency: string;
  description?: string;
  transaction_reference: string;
  wallet: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    transaction_type: {
      type: String,
      enum: ["CREDIT", "DEBIT"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    transaction_category: {
      type: String,
      enum: Object.values(TransactionCategory),
      required: true,
    },
    transaction_status: {
      type: String,
      enum: ["Successful", "Pending", "Failed"],
      required: true,
    },
    balance_before: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
    },
    balance_after: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
    },
    charge: {
      type: Number,
      required: true,
      default: 0.0,
    },
    currency: {
      type: String,
      default: "NGN",
    },
    description: {
      type: String,
    },
    transaction_reference: {
      type: String,
      required: true,
    },
    wallet: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
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

export const Transaction = mongoose.model<ITransaction>(
  "Transaction",
  transactionSchema
);
