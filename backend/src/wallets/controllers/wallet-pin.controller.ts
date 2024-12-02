import { RequestWithUser, successHandler, errorHandler } from "../../utils/helper.functions";
import { setWalletPin } from "../services/wallet-pin.service";
import { SetWalletPinDTO } from "../dtos/wallet-pin.dto";
import { Response } from "express";

export const setWalletPinController = async(req: RequestWithUser, res: Response) => {
     try {
          const data: SetWalletPinDTO = req.body;
          const setPin = await setWalletPin( data.wallet_pin, req.user)

          return successHandler(res, 'wallet pin set', setPin);

     } catch (error: any) {
          console.log(error);
        return errorHandler(res, error.message ||'Could not set wallet pin');
     }
}