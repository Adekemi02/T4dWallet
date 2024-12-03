import { Request, Response } from "express";
import {
  errorHandler,
  RequestWithUser,
  successHandler,
} from "../../utils/helper.functions";
import {
  fundWalletService,
  getUserWallet,
  getWalletById,
  withdrawFundService,
} from "../services/wallet.service";
import {
  FundWalletDTO,
  ResolveWalletDTO,
  WithdrawFundDTO,
} from "../dtos/wallet.dto";
import {
  IGetUserWalletResponse,
  IResolveWalletResponse,
} from "../types/wallet.types";

export const fundWalletController = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    const data: FundWalletDTO = req.body;
    const fundedWallet = await fundWalletService(data, req.user);

    return successHandler(res, "Wallet funded successfully", {});
  } catch (error: any) {
    console.log(error);
    return errorHandler(res, error.message || "could not fund wallet");
  }
};
export const withdrawFundsController = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    const data: WithdrawFundDTO = req.body;
    const fundedWallet = await withdrawFundService(data, req.user);

    return successHandler(res, "Withdrawal successful", {});
  } catch (error: any) {
    console.log(error);
    return errorHandler(res, error.message || "Could not make withdrawal");
  }
};

export const getUserWalletController = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    const wallet = await getUserWallet(req.user.id);

    const details: IGetUserWalletResponse = {
      _id: wallet.id,
      wallet_id: wallet.wallet_id,
      wallet_name: wallet.wallet_name,
      balance: parseFloat(wallet.balance.toString()),
      status: wallet.status,
    };

    return successHandler(res, "Wallet retrieved successfully", details);
  } catch (error: any) {
    console.log(error);
    return errorHandler(res, error.message || "could not get user wallet");
  }
};

export const resolveWalletController = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    const data: ResolveWalletDTO = req.body;

    const wallet = await getWalletById(data.walletId);

    const details: IResolveWalletResponse = {
      _id: wallet.id,
      wallet_id: wallet.wallet_id,
      walletName: wallet.wallet_name,
      status: wallet.status,
    };

    return successHandler(res, "Wallet resolved successfully", details);
  } catch (error: any) {
    console.log(error);
    return errorHandler(res, error.message || "could not resolve wallet");
  }
};
