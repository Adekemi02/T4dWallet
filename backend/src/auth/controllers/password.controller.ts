import { Request, Response } from "express";
import { errorHandler, successHandler } from "../../utils/helper.functions";
import { TForgotPasswordPayload, TResetPasswordPayload } from "../services/passwords/types/passwords.types";
import { forgotPasswordService, resetPasswordService } from "../services/passwords/passwords.service";
import { ForgotPasswordDTO, ResetPasswordDTO } from "../dtos/password.dto";


export const forgotPasswordController = async(req: Request, res: Response) => {
     try {
          const data: ForgotPasswordDTO = req.body;          

          const result = await forgotPasswordService(data);

          return successHandler(res, 'OTP sent to your email', result);

     } catch (error: any) {
          console.log('Error sending OTP: ', error);
          return errorHandler(res, error.message || 'Error sending OTP');    
     };
}

export const resetPasswordController = async(req: Request, res: Response) => {
     try {
          const data: ResetPasswordDTO = req.body;          

          const result = await resetPasswordService(data);

          return successHandler(res, 'Password reset successfully', result);

     } catch (error: any) {
          console.log('Error resetting password, please try again: ', error);
          return errorHandler(res, error.message || 'Error resetting your password, please try again.');    
     };
}