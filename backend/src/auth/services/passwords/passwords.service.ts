import mongoose from "mongoose";
import { createOTP, findByEmail } from "../../queries/signup.queries";
import { generateOTP, hashPassword, isValidPassword } from "../../../utils/helper.functions";
import { IOtp, OTP } from "../../models/otp.model";
import { sendEMail } from "../../../utils/emails/send-email";
import { User } from "../../models/user.model";
import {
  TForgotPasswordPayload,
  TForgotPasswordResponse,
  TResetPasswordPayload,
} from "./types/passwords.types";
import { IMailData } from "../../../utils/emails/types";

export const forgotPasswordService = async (
  payload: TForgotPasswordPayload
): Promise<TForgotPasswordResponse> => {
  try {
    const userExist = await findByEmail(payload);

    if (!userExist) throw new Error("User not found");

    const { otp, expiresAt } = generateOTP();

        // hash otp
        const hashedCode = await hashPassword(otp);

    const otpPayload: Partial<IOtp> = {
      code: hashedCode,
      expires_at: expiresAt,
    };

    const otpId = await createOTP(otpPayload);

    userExist.otp = otpId._id as mongoose.Types.ObjectId;

    await userExist.save();

    const mailData: IMailData = {
      templateKey: "forgotPasswordEmail",
      email: payload.email,
      placeholders: { OTP: otp, firstname: userExist.first_name },
      subject: "Password Reset Request",
    };

    await sendEMail(mailData);

    return {
      otp: otp,
      email: payload.email,
    };
  } catch (error: any) {
    console.log("Error sending OTP: ", error);
    throw new Error(error.message || "Error sending OTP");
  }
};

const MAX_FAILED_ATTEMPTS = 5;

export const resetPasswordService = async (payload: TResetPasswordPayload) => {
  try {

    const userExist = await findByEmail({email: payload.email});

    if (!userExist) throw new Error("User not found");

    const otpRecord = await OTP.findOne({
      _id: userExist.otp,
      expires_at: { $gt: new Date() },
    });

    
      if (!otpRecord) {
        await OTP.findOneAndUpdate(
          { _id: userExist.otp },
          { $inc: { failed_attempts: 1 } }
        );
        throw new Error("OTP has expired");
      }

    if (!(await isValidPassword(payload.otp, otpRecord.code))) {
      throw new Error("Invalid OTP");
    }
    // const MAX_FAILED_ATTEMPTS = parseInt(process.env.FAILED_ATTEMPTS);
    if (otpRecord.failed_attempts >= MAX_FAILED_ATTEMPTS) {
      throw new Error("Maximum failed attempts reached");
    }

    const hashedPassword = await hashPassword(payload.newPassword);
    const updatedUser = await User.findOneAndUpdate(
      { email: payload.email },
      {
        password_hash: hashedPassword,
        otp: null
      },
      { new: true }
    );

    console.log('pass-', payload.newPassword, 'hashed:- ', hashedPassword, 'updatedUser:- ', updatedUser.password_hash, 'password:- ', userExist.password_hash);

    
    if (!updatedUser) {
      await OTP.findByIdAndUpdate(otpRecord._id, {
        $inc: { failed_attempts: 1 },
      });
      throw new Error("User not found");
    }
    const check = await OTP.findByIdAndUpdate(otpRecord._id, {
      used: true,
      failed_attempts: 0,
    });

    return true;
  } catch (error: any) {
    console.error("Error during password reset: ", error);
    throw new Error(error.message || "Error resetting password");
  }
};
