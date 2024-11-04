import { createOTP, createUser, findByEmail } from "../../database/queries/signup.queries";
import { IResendOTP, IResendOTPServiceResult, ISignupPayload, IVerifyOTP, IVerifyOTPServiceResult } from "../interfaces/signup.interface";
import { generateAccessToken, generateOTP, hashPassword, isOTPExpired } from "../../utils/helper.functions";
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

          // hash otp
          const hashedCode = await hashPassword(otp)

          const otpPayload: Partial<IOtp> = {
               code: hashedCode,
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

export const verifyOTPService = async (data: IVerifyOTP): Promise<IVerifyOTPServiceResult> => {
     try {
       const { email, otp } = data;
   
       // Check if user exists
       const userExist = await findByEmail({ email });
   
       if (!userExist) throw new Error("Unauthorized user");
   
       // Fetch the OTP document linked to the user
       const getOtp = await OTP.findById(userExist.otp);
   
       if (!getOtp) throw new Error('Invalid code');
   
       // Debug logs (ensure you remove these in production)
       console.log('Received OTP:', otp);
       console.log('Stored OTP hash:', getOtp.code);
   
       // Verify if the OTP code matches
       const isValidCode = await bcrypt.compare(otp, getOtp.code);
       if (!isValidCode) throw new Error('Invalid code');
   
       // Check if OTP is expired
       if (isOTPExpired(getOtp.expires_at)) throw new Error("OTP expired");
   
       // Update user, nullifying the OTP field
       const updatedUser = await User.findOneAndUpdate({ email }, { otp: null }, {new: true});
   
       // Delete the OTP entry after successful verification
       await OTP.findByIdAndDelete(getOtp.id);
   
       // Return the user and generate access token
       return {
         user: updatedUser,
         token: generateAccessToken(userExist.id),
       };
   
     } catch (error: any) {
       console.error('Error verifying OTP:', error);
       throw new Error(error.message || 'Could not verify OTP');
     }
   };

export const resendOTPService = async (data: IResendOTP): Promise<IResendOTPServiceResult> => {
     const { email } = data

     const userExist = await findByEmail({ email })
     

     if (!userExist) throw new Error("Unauthorized user");

     const { otp, expiresAt } = generateOTP();

     const hashedCode = await hashPassword(otp)

     const otpPayload: Partial<IOtp> = {
          code: hashedCode,
          expires_at: expiresAt,

     }
     const otpId = await createOTP(otpPayload);

     const updateUser = await User.findOneAndUpdate({email}, {otp: otpId.id}, {new: true});

     return { otp };
}
