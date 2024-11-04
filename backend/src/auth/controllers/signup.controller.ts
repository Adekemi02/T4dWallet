import { Request, Response } from "express";
import { errorHandler, successHandler } from "../../utils/helper.functions";
import { SignupDTO, VerifyOTPDTO } from "../dtos/signup.dto";
import { resendOTPService, signupService, verifyOTPService } from "../services/signup.service";

export const signupController = async(req: Request, res: Response) => {
     try {
          const data: SignupDTO = req.body;          

          const newUser = await signupService(data);

          const response = {
               firstName: newUser.first_name,
               lastName: newUser.last_name,
               email: newUser.email,
               status: newUser.status,
          }

          return successHandler(res, 'Signup successful', response)

     } catch (error: any) {
          console.log('Could not complete signup: ', error);
          return errorHandler(res, error.message || 'Could not complete signup')
          
     }
}

  export const verifyOTPController = async(req: Request, res: Response) => {
     try {
          const data: VerifyOTPDTO = req.body;
 
          const result = await verifyOTPService(data); 
 
          const user = {
             id: result.user.id,
             id2: result.user._id,
             email: result.user.email,
             password: result.user.password_hash,
             otp: result.user.otp,
             token: result.token
          };
 
          return successHandler(res, "Verification successful", user);
          
      } catch (error: any) {
         console.log(error);
          errorHandler(res, error.message);
 
          return;
      
      }
  }

  export const resendOTPControler = async (req: Request, res: Response) => {
     try {
 
         const email = req.params.email;
 
         const otp = await resendOTPService({email})
 
         return successHandler(res, "Email resent", {otp});
 
     } catch (error: any) {
         console.log(error);
          return errorHandler(res, error.message);
      
      }
  }
 