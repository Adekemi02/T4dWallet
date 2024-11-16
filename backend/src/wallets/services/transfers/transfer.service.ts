import mongoose from "mongoose";
import { IUser } from "../../../auth/models/user.model";
import { creditWalletService, debitWalletService } from "../wallet.service";
import { ITransferChargeResponse, ITransferPayload } from "./types/transfer.types";
import { createTransaction } from "../../../transactions/services/transaction.service";
import { TransactionCategory } from "../../../transactions/interfaces/transaction.interface";
import { formatTransactionDate, generateULIDForEntity } from "../../../utils/helper.functions";
import { IWalletStates } from "../../../wallets/types/wallet.types";
import { IMailData } from "../../../utils/emails/types";
import { sendEMail } from "../../../utils/emails/send-email";
import { Wallet } from "../../../wallets/models/wallet.model";
import { appEmitter } from "../../../globals/events";
import { WALLET_EVENTS } from "../../../wallets/events/wallets.events";

export const calculateCharge = (amount: number): ITransferChargeResponse => {
  let charge = 0;

  if (amount < 25000) {
    charge = 10.76; // Charge for amounts less than 25,000 Naira
  } else if (amount >= 25000 && amount < 50000) {
    charge = 26.67; // Charge for amounts between 25,000 and 49,999 Naira
  } else if (amount >= 50000 && amount < 100000) {
    charge = 50.00; // Charge for amounts between 50,000 and 99,999 Naira
  } else if (amount >= 100000) {
    charge = 100.00; // Charge for amounts greater than or equal to 100,000 Naira
  }

  // Return both the charge and the new amount (amount + charge)
  const newAmountWithCharge = amount + charge;
  return {
    charge,
    newAmountWithCharge
  };
};

export const transferFunds = async (payload: ITransferPayload, user: IUser,): Promise<IWalletStates> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    const { charge, newAmountWithCharge } = calculateCharge(payload.amount);
    // Debit the user's wallet
    const debitUserWallet = await debitWalletService(user, newAmountWithCharge, session);

    const recipientWallet = await Wallet.findOne({ wallet_id: payload.receipientId }).populate<{ user: IUser }>('user').orFail();

    // Get the recipient's user details
    const recipient = recipientWallet.user;

    if (recipient.id === user.id) {
      throw new Error('Something went wrong! Please try again.');
    }

    // Credit the recipient's wallet
    const creditRecipientWallet = await creditWalletService(recipientWallet.user.id, payload.amount, session);

    const transactionRef = generateULIDForEntity('TRANS-');


    // Create a debit transaction for the user
    const transaction = await createTransaction({
      transaction_category: TransactionCategory.WALLET_TRANSFER,
      transaction_type: 'DEBIT',
      transaction_reference: transactionRef,
      balance_after: mongoose.Types.Decimal128.fromString(
        parseFloat(debitUserWallet.curr_wallet.balance.toString()).toFixed(2)
      ),
      balance_before: mongoose.Types.Decimal128.fromString(
        parseFloat(debitUserWallet.prev_wallet.balance.toString()).toFixed(2)
      ),
      charge: charge,
      amount: payload.amount,
      description: payload.description || 'Transfer Successful',
      wallet: debitUserWallet.curr_wallet.id,
      user: user.id,
      currency: 'NGN',
      transaction_status: 'Successful',
    });

    // Optionally, create a credit transaction for the recipient
    const recipientTransaction = await createTransaction({
      transaction_category: TransactionCategory.WALLET_TRANSFER,
      transaction_type: 'CREDIT',
      transaction_reference: transactionRef,
      balance_after: mongoose.Types.Decimal128.fromString(
        parseFloat(creditRecipientWallet.curr_wallet.balance.toString()).toFixed(2)
      ),
      balance_before: mongoose.Types.Decimal128.fromString(
        parseFloat(creditRecipientWallet.prev_wallet.balance.toString()).toFixed(2)
      ),
      charge: 0,
      amount: payload.amount,
      description: payload.description || `Received from ${user.first_name} ${user.last_name}`,
      wallet: creditRecipientWallet.curr_wallet.id,
      user: recipient.id,
      currency: 'NGN',
      transaction_status: 'Successful',
    });

    const transactionDate = formatTransactionDate(new Date());

    // Emit the event to send emails
    appEmitter.emit(WALLET_EVENTS.FUNDS_TRANSFERRED, {
      sender: user,
      recipientWalletId: payload.receipientId,
      amount: payload.amount,
      charge: charge,
      transactionRef: transactionRef,
      transactionDate: transactionDate,
    });

    // Commit the transaction if all operations are successful
    await session.commitTransaction();
    session.endSession();

    return debitUserWallet;

  } catch (error: any) {
    // Abort the transaction in case of error
    await session.abortTransaction();
    session.endSession();

    console.log('Could not transfer funds from wallet', error);
    throw new Error(error.message || 'Could not transfer funds from wallet');
  }
};


appEmitter.on(WALLET_EVENTS.FUNDS_TRANSFERRED, async (data) => {
  try {
    const recipientWallet = await Wallet.findOne({ wallet_id: data.recipientWalletId })
      .populate<{ user: IUser }>('user')
      .orFail();

    const recipient = recipientWallet.user;

    const mailData1: IMailData = {
      templateKey: 'transferEmail',
      email: data.sender.email,
      placeholders: {
        firstname: data.sender.first_name,
        amount: data.amount.toString(),
        TransactionID: data.transactionRef,
        charge: data.charge.toString(),
        RecipientName: `${recipient.first_name} ${recipient.last_name}`,
        RecipientWalletID: data.recipientWalletId,
        DateTime: data.transactionDate,
      },
      subject: 'Transfer Successful',
    };

    await sendEMail(mailData1);

    const mailData2: IMailData = {
      templateKey: 'creditEmail',
      email: recipient.email,
      placeholders: {
        firstname: recipient.first_name,
        amount: data.amount.toString(),
        SenderName: `${data.sender.first_name} ${data.sender.last_name}`,
        TransactionID: data.transactionRef,
        DateTime: data.transactionDate,
      },
      subject: 'Transfer Successful',
    };

    await sendEMail(mailData2);
  } catch (error) {
    console.error('Error sending emails:', error);
  }
});
