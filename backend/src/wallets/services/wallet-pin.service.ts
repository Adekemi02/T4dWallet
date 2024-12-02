import { hashPassword } from "../../utils/helper.functions";
import { IUser } from "../../auth/models/user.model";
import { Wallet } from "../models/wallet.model";

export const setWalletPin = async(newPin: string, user: IUser, ): Promise<boolean> => {
     try {
          const wallet = await Wallet.findOne({ user: user._id }).orFail();

          const complexPin = await hashPassword(newPin);

          if (wallet.wallet_pin_changed) {
               throw new Error('you cannot change your pin at this time')
          }

          wallet.wallet_pin = complexPin;

          await wallet.save()

          return true

     } catch (error) {
          console.log('Could not set wallet pin:', error);
          throw new Error('Could not set wallet pin:');
        }
   }