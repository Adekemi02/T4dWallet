import mongoose from "mongoose";
import { ICreateTransactionInput } from "../interfaces/transaction.interface";
import { ITransaction, Transaction } from "../models/transaction.model"

export const createTransaction = async (
  payload: ICreateTransactionInput,
  options?: { session: mongoose.ClientSession }
): Promise<ITransaction> => {
  try {
    const transaction = new Transaction({
      transaction_type: payload.transaction_type,
      amount: payload.amount,
      charge: payload.charge,
      currency: payload.currency,
      transaction_category: payload.transaction_category,
      transaction_status: payload.transaction_status,
      balance_before: payload.balance_before,
      balance_after: payload.balance_after,
      description: payload.description,
      transaction_reference: payload.transaction_reference,
      wallet: payload.wallet,
      user: payload.user,
    });

    return await transaction.save();
  } catch (error) {
    console.log("could not create transaction", error);

    throw new Error("could not create transaction");
  }
};


// export const createTransaction = async(payload: ICreateTransactionInput): Promise<ITransaction> => {
//      try {
//           return Transaction.create(payload)
//      } catch (error) {
//           throw new Error('could not create transaction')
//      }
// }