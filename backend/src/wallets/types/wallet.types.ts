import { Types } from "mongoose";
import { IWallet } from "../models/wallet.model";

export interface IWalletStates {
     prev_wallet: IWallet;
     curr_wallet: IWallet;
}

export interface IFundWalletPayload {
     amount: number;
     description: string;
}

export interface IWithdrawFundPayload extends Pick<IFundWalletPayload, 'amount'> {}

export interface IGetUserWalletResponse {
     _id: string,
     wallet_id: string,
     balance: number,
     status: string,
}