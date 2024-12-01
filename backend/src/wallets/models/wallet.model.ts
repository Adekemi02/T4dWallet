import mongoose, { Schema, Document, Types } from "mongoose";

// export enum WalletStatus {
//   ACTIVE = 'ACTIVE',
//   INACTIVE = 'INACTIVE',
//   SUSPENDED = 'SUSPENDED'
// }

export interface IWalletStatusUpdateOptions {
  inactiveDays: number;
  suspensionDays: number;
}

export interface IWallet extends Document {
  wallet_id: string;
  balance: Types.Decimal128;
  prev_balance: Types.Decimal128;
  wallet_pin: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  last_transaction_date: Date;
  last_status_change_date: Date;
  user: mongoose.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

const walletSchema = new Schema<IWallet>(
  {
    wallet_id: {
      type: String,
      required: true,
      unique: true,
    },

    balance: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      default: mongoose.Types.Decimal128.fromString('0.00'),
    },

    prev_balance: {
      type: mongoose.Schema.Types.Decimal128,
      required: false,
      default: mongoose.Types.Decimal128.fromString('0.00'),
    },

    wallet_pin: {
      type: String,
      required: false,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "SUSPENDED"],
      default: "ACTIVE",
      required: true,
    },

    last_transaction_date: {
      type: Date,
      default: Date.now
    },

    last_status_change_date: {
      type: Date,
      default: Date.now
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export const Wallet = mongoose.model<IWallet>("Wallet", walletSchema);
