import { Request, Response } from "express";
import { errorHandler, successHandler } from "../../utils/helper.functions";
import { SignupDTO } from "../dtos/signup.dto";
import { signupService, verifyAccessService } from "../services/signup.service";

export const signupController = async(req: Request, res: Response) => {
     try {
          const data: SignupDTO = req.body;          

          const newUser = await signupService(data);

          const createdUser = {
               firstName: newUser.first_name,
               lastName: newUser.last_name,
               email: newUser.email,
               status: newUser.status,
          }

          return successHandler(res, 'Signup successful', createdUser)

     } catch (error: any) {
          console.log('Could not complete signup: ', error);
          return errorHandler(res, error.message || 'Could not complete signup')
          
     }
}

export const verifyAccessController = async(req: Request, res: Response) => {
     const { id, code } = req.query;
    try {
      await verifyAccessService(id as string, code as string);
      res.status(200).json({
        success: true,
        message: "Email verified successfully",
      });
    } catch (error: any) {
     return errorHandler(res, error.message )
    }
  }
