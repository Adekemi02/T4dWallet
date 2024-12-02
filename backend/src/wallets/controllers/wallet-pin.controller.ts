import {
  RequestWithUser,
  successHandler,
  errorHandler,
} from "../../utils/helper.functions";
import { changeWalletPin, setWalletPin, validateWalletPin } from "../services/wallet-pin.service";
import { ChangeWalletPinDTO, SetWalletPinDTO } from "../dtos/wallet-pin.dto";
import { Response } from "express";

export const setWalletPinController = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    const data: SetWalletPinDTO = req.body;
    const setPin = await setWalletPin(data.wallet_pin, req.user);

    return successHandler(res, "wallet pin set", setPin);
  } catch (error: any) {
    console.log(error);
    return errorHandler(res, error.message || "Could not set wallet pin");
  }
};

export const changeWalletPinController = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    const data: ChangeWalletPinDTO = req.body;

    const payload = {
      oldPin: data.old_pin,
      newPin: data.new_pin,
    };
    const resetPin = await changeWalletPin(payload, req.user);

    return successHandler(res, "wallet pin updated successfully", resetPin);
  } catch (error: any) {
    console.log(error);
    return errorHandler(res, error.message || "Could not reset wallet pin");
  }
};

export const validateWalletPinController = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    const data: SetWalletPinDTO = req.body;

    const walletPin = data.wallet_pin;

    const resetPin = await validateWalletPin(walletPin, req.user);

    return successHandler(res, "wallet pin validated", resetPin);
  } catch (error: any) {
    // console.log(error);
    return errorHandler(res, error.message || "Could not validate wallet pin");
  }
};
