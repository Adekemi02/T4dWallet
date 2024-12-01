import { Request, Response } from "express";
import { errorHandler, RequestWithUser, successHandler } from "../../utils/helper.functions";
import { creditWalletService, deactivateWallet, debitWalletService, fundWalletService, getUserWallet, getWalletById, reactivateWallet } from "../services/wallet.service";
import { CreditWalletDTO, FundWalletDTO } from "../dtos/wallet.dto";
import { IGetUserWalletResponse, IReactivateWalletResponse } from "../types/wallet.types";

export const creditWalletController = async(req: RequestWithUser, res: Response) => {
     try {
          const data: CreditWalletDTO = req.body;
          const creditWallet = await creditWalletService(req.user.id, data.amount)

          return successHandler(res, 'Wallet credited successfully', {});

     } catch (error: any) {
          console.log(error);
        return errorHandler(res, error.message);
     }
};

export const debitWalletController = async(req: RequestWithUser, res: Response) => {
     try {
          const data: CreditWalletDTO = req.body;
          const debitWallet = await debitWalletService(req.user, data.amount)

          return successHandler(res, 'Wallet debited successfully', {});

     } catch (error: any) {
          console.log(error);
        return errorHandler(res, error.message);
     }
}
export const fundWalletController = async(req: RequestWithUser, res: Response) => {
     try {
          const data: FundWalletDTO = req.body;
          const fundedWallet = await fundWalletService( data, req.user)

          return successHandler(res, 'Wallet funded successfully', {});

     } catch (error: any) {
          console.log(error);
        return errorHandler(res, error.message ||'could not fund wallet');
     }
}

export const getUserWalletController = async(req: RequestWithUser, res: Response) => {
     try {
          const wallet = await getUserWallet(req.user.id)

          const details: IGetUserWalletResponse = {
               _id: wallet.id,
               wallet_id: wallet.wallet_id,
               balance: parseFloat(wallet.balance.toString()),
               status: wallet.status,
          }

          return successHandler(res, 'Wallet funded successfully', details);

     } catch (error: any) {
          console.log(error);
        return errorHandler(res, error.message || 'could not get user wallet');
     }
}

export const reactivateWalletController = async(req: RequestWithUser, res: Response) => {
     try {
          const { walletId } = req.params;
          const wallet = await reactivateWallet(walletId, req.user.id);

          const details: IReactivateWalletResponse = {
               wallet_id: wallet.wallet_id,
               status: wallet.status,
               balance: parseFloat(wallet.balance.toString()),
               last_status_change_date: wallet.last_status_change_date
          };

          return successHandler(res, "Wallet reactivated successfully", details);

     } catch (error: any) {
          return errorHandler(res, error.message || "Could not reactivate wallet.");
     }
}

export const deactivateWalletController = async(req: RequestWithUser, res: Response) => {
     try {
          const { walletId } = req.params;
          const wallet = await deactivateWallet(walletId, req.user.id);

          const details = {
               message: wallet.message
          };

          return successHandler(res, "Wallet successfully deleted", details);

     } catch (error: any) {
          return errorHandler(res, error.message || "Could not delete a wallet")
     }
}