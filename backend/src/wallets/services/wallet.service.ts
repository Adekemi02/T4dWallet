import { IUser } from "../../auth/models/user.model"
import { IWallet, Wallet } from "../models/wallet.model"
import { cloneObj, formatTransactionDate, generateULIDForEntity, generateWalletId } from "../../utils/helper.functions";
import mongoose from "mongoose";
import { appEmitter } from "../../globals/events";
import { WALLET_EVENTS } from "../events/wallets.events";
import { IFundWalletPayload, IWalletStates } from "../types/wallet.types";
import { createTransaction } from "../../transactions/services/transaction.service";
import { TransactionCategory } from "../../transactions/interfaces/transaction.interface";
import { IMailData } from "../../utils/emails/types";
import { sendEMail } from "../../utils/emails/send-email";

export const createWalletService = async(user: IUser): Promise<IWallet> => {
     try {
          const walletExists = await Wallet.findOne().where({ user: user._id});

          if (!!walletExists) {
               return walletExists;
          };

          const newWallet = await Wallet.create({
             wallet_id: await generateWalletId(),
             balance: mongoose.Types.Decimal128.fromString('0.00'),
             wallet_pin: '',
             status: 'ACTIVE',
             user: user._id,
          });

          return newWallet;
     } catch (error) {
          console.log('could not create new wallet', error);
          throw new Error('could not create new wallet')   
     }
};

appEmitter.on(WALLET_EVENTS.USER_CONFIRMED_OTP, async (user: IUser) => {
     try {
       console.log(`Creating wallet for user ${user._id}`);
       await createWalletService(user);
     } catch (error) {
       console.error(`Failed to create wallet for user ${user._id}:`, error);
     }
   });

   export const debitWalletService = async (user: IUser, amount: number, session?: mongoose.ClientSession): Promise<IWalletStates> => {
     try {
       const wallet = await Wallet.findOne({ user: user._id }).session(session).orFail();
   
       // Clone the wallet before debiting
       const previousWallet = cloneObj(wallet);
   
       // Convert wallet balance (Decimal128) to number for comparison
       const walletBalance = parseFloat(wallet.balance.toString());
   
       // Check if the wallet has sufficient balance
       if (walletBalance < amount) {
         throw new Error('Insufficient balance');
       }
   
       // Debit the wallet by subtracting the amount
       const newBalance = walletBalance - amount;
   
       // Ensure balance is a valid Decimal128
       wallet.balance = mongoose.Types.Decimal128.fromString(newBalance.toFixed(2));
   
       // Save the updated wallet within the transaction session
       const updatedWallet = await wallet.save({ session });

       return {
          prev_wallet: previousWallet,
          curr_wallet: updatedWallet,
       };
     } catch (error: any) {
       console.log('Could not debit wallet:', error);
       throw new Error(error.message || 'Could not debit wallet');
     }
   };
   
   export const creditWalletService = async (userId: string, amount: number, session?: mongoose.ClientSession): Promise<IWalletStates> => {
     try {
       const wallet = await Wallet.findOne({ user: userId }).session(session).orFail();
   
       // Clone the wallet before debiting
       const previousWallet = cloneObj(wallet);       
   
       // Convert wallet balance (Decimal128) to number for comparison
       const walletBalance = parseFloat(wallet.balance.toString());
   
       // Credit the wallet by adding the amount
       const newBalance = walletBalance + amount;
   
       // Ensure balance is a valid Decimal128
       wallet.balance = mongoose.Types.Decimal128.fromString(newBalance.toFixed(2));
   
       // Save the updated wallet within the transaction session
       const updatedWallet = await wallet.save({ session });
   
       return {
          prev_wallet: previousWallet,
          curr_wallet: updatedWallet,
       };
     } catch (error) {
       console.log('Could not credit wallet:', error);
       throw new Error('Could not credit wallet');
     }
   };

   export const fundWalletService = async (payload: IFundWalletPayload, user: IUser): Promise<IWallet> => {
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      // Fetch the user's wallet
      const wallet = await Wallet.findOne({ user: user._id }).session(session).orFail(new Error("Wallet not found"));
  
      // Clone the current wallet state for logging (optional)
      const previousWallet = { ...wallet.toObject() };
  
      // Convert Decimal128 balance to a float for manipulation
      const walletBalance = parseFloat(wallet.balance.toString());
  
      // Add the funding amount to the wallet balance
      const newBalance = walletBalance + payload.amount;
  
      // Update the wallet balance
      wallet.balance = mongoose.Types.Decimal128.fromString(newBalance.toFixed(2));
  
      // Save the updated wallet
      const updatedWallet = await wallet.save({ session });
  
      // Log the transaction
      await createTransaction({
        transaction_category: TransactionCategory.WALLET_FUNDING,
        transaction_type: "CREDIT",
        transaction_reference: generateULIDForEntity("TRANS-"),
        balance_before: mongoose.Types.Decimal128.fromString(walletBalance.toFixed(2)),
        balance_after: mongoose.Types.Decimal128.fromString(newBalance.toFixed(2)),
        charge: 0,
        amount: payload.amount,
        description: payload.description || "Wallet funded successfully",
        wallet: wallet.id,
        user: user.id,
        currency: "NGN",
        transaction_status: "Successful",
      });

      
    const transactionDate = formatTransactionDate(new Date());

      appEmitter.emit(WALLET_EVENTS.WALLET_FUNDED, {
        sender: user,
        amount: payload.amount,
      });
  
      // Commit the transaction
      await session.commitTransaction();
      session.endSession();
  
      return updatedWallet;
    } catch (error) {
      // Rollback the transaction on error
      await session.abortTransaction();
      session.endSession();
  
      console.error("Could not fund wallet:", error);
      throw new Error("Could not fund wallet");
    }
  };

//    export const setWalletPin = async(wallet: IWallet, newPin: string): Promise<boolean> => {
//      try {

//      }
//    }

export const getUserWallet = async(userId: string): Promise<IWallet> => {
     try {
          const wallet = await Wallet.findOne().where({ user: userId}).exec();

          if (!wallet) throw new Error('User does not have a wallet');

          return wallet;

     } catch (error) {
          console.log('Could not get user wallet:', error);
          throw new Error('Could not get user wallet');
        }
}

export const getWalletById = async(walletId: string): Promise<IWallet> => {
     try {
          const wallet = await Wallet.findOne({ wallet_id: walletId}).exec();

          if (!wallet) throw new Error('Wallet does not exist');

          return wallet;

     } catch (error) {
          console.log('Could not resolve wallet:', error);
          throw new Error('Could not resolve wallet');
        }
}

appEmitter.on(WALLET_EVENTS.WALLET_FUNDED, async (data) => {
  try {

    const mailData: IMailData = {
      templateKey: 'fundEmail',
      email: data.sender.email,
      placeholders: {
        firstname: data.sender.first_name,
        amount: data.amount.toString(),
        DateTime: data.transactionDate,
      },
      subject: 'Transfer Successful',
    };

    await sendEMail(mailData);

    
  } catch (error) {
    console.error('Error sending emails:', error);
  }
});