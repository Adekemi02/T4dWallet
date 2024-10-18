import { createOTP, createUser, findByEmail } from "../../database/queries/signup.queries";
import { ISignupPayload } from "../interfaces/signup.interface";
import { generateOTP, hashPassword } from "../../utils/helper.functions";
import { IOtp, OTP } from "../models/otp.model";
import mongoose, { isValidObjectId } from "mongoose";
import { sendSignUpMail } from "../../utils/send-email";
import { ISignupMail } from "../../utils/types";
import { IUser, User } from "../models/user.model";
import bcrypt from "bcrypt"

export const signupService = async (payload: ISignupPayload): Promise<IUser> => {
     try {
          const userExist = await findByEmail(payload);

          if (userExist) throw new Error("User with details already exist...Login");

          const { otp, expiresAt } = generateOTP();

          const otpPayload: Partial<IOtp> = {
               code: otp,
               expires_at: expiresAt,

          }
          const otpId = await createOTP(otpPayload);

          const hashedPassword = await hashPassword(payload.password);

          const createPayload = {
               ...payload,
               password: hashedPassword,
               otp: otpId._id as mongoose.Types.ObjectId,
          }

          const newUser = await createUser(createPayload)

          const mailData: ISignupMail = {
               email: payload.email,
               otp: otp,
               firstName: payload.firstName,
          }

          await sendSignUpMail(mailData);

          return newUser;
     } catch (error: any) {
          console.log('Could not create user: ', error);
          throw new Error(error.message || 'Could not create user')
          
     }
}


export const verifyAccessService = async (codeId: string, code: string) => {
     if (!codeId || !code) {
       throw new Error("Invalid request parameters");
     }
 
     if (!isValidObjectId(codeId) || !code) {
       throw new Error("Invalid request parameters");
     }
 
     const existingcode = await OTP.findById(codeId);
     if (!existingcode) {
       throw new Error("code not found");
     }
 
     const isValidcode = await bcrypt.compare(code, existingcode.code);
     if (!isValidcode) {
       throw new Error("Invalid or expired code");
     }
 
     const user = await User.findById(existingcode.userId);
     if (!user) {
       throw new Error("User not found");
     }
 
     user.isVerified = true;
     await user.save();
 
     await OTP.findByIdAndDelete(existingcode._id);
   }