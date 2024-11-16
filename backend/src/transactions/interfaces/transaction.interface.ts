import { Types } from "mongoose";
import { ITransaction } from "../models/transaction.model";

export type TransactionStatus = "Successful" | "Pending" | "Failed";

export enum TransactionCategory {
  WALLET_TRANSFER = "wallet transfer",
  CURRENCY_EXCHANGE = "currency exchange",
  WALLET_FUNDING = "wallet funding",
  TRANSFER_CHARGE = 'charge',
}

// export type TCreateTransactionInput = Omit<
//   ITransaction,
//   "_id" | "created_at" | "updated_at"
// >;
export interface ICreateTransactionInput {
  transaction_type: "CREDIT" | "DEBIT",
  amount: number,
  charge: number,
  currency: string,
  transaction_category: TransactionCategory,
  transaction_status: TransactionStatus,
  balance_before: Types.Decimal128,
  balance_after: Types.Decimal128,
  description: string,
  transaction_reference: string,
  wallet: string,
  user: string,
}

