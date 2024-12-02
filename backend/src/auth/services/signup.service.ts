import { createOTP, createUser, findByEmail } from "../queries/signup.queries";
import {
  IResendOTP,
  IResendOTPServiceResult,
  ISignupPayload,
  IVerifyOTP,
  IVerifyOTPServiceResult,
} from "../interfaces/signup.interface";
import {
  generateAccessToken,
  generateOTP,
  hashPassword,
  isOTPExpired,
} from "../../utils/helper.functions";
import { IOtp, OTP } from "../models/otp.model";
import mongoose from "mongoose";
import { IUser, User } from "../models/user.model";
import bcrypt from "bcrypt";
import { IMailData } from "../../utils/emails/types";
import { sendEMail } from "../../utils/emails/send-email";
import { appEmitter } from "../../globals/events";
import { WALLET_EVENTS } from "../../wallets/events/wallets.events";

/**
 * Handles user signup by creating a new user, generating an OTP, and sending a verification email.
 *
 * @param payload - The signup details provided by the user.
 * @returns The newly created user object.
 * @throws An error if the user already exists or if the signup process fails.
 */
export const signupService = async (
  payload: ISignupPayload
): Promise<IUser> => {
  try {
    const userExist = await findByEmail(payload);

    if (userExist) throw new Error("User with details already exist...Login");

    const { otp, expiresAt } = generateOTP();

    // hash otp
    const hashedCode = await hashPassword(otp);

    const otpPayload: Partial<IOtp> = {
      code: hashedCode,
      expires_at: expiresAt,
    };
    const otpId = await createOTP(otpPayload);

    const hashedPassword = await hashPassword(payload.password);

    const createPayload = {
      ...payload,
      password: hashedPassword,
      otp: otpId._id as mongoose.Types.ObjectId,
    };

    const newUser = await createUser(createPayload);

    const mailData: IMailData = {
      templateKey: "confirmEmail",
      email: payload.email,
      placeholders: { OTP: otp, firstname: payload.firstName },
      subject: "Email Verification",
    };

    await sendEMail(mailData);

    return newUser;
  } catch (error: any) {
    console.log("Could not create user: ", error);
    throw new Error(error.message || "Could not create user");
  }
};

/**
 * Verifies a user's OTP for email confirmation.
 *
 * @param data - Contains the email and OTP provided by the user.
 * @returns An object containing the verified user and an access token.
 * @throws An error if the user is unauthorized, OTP is invalid, or expired.
 */
export const verifyOTPService = async (
  data: IVerifyOTP
): Promise<IVerifyOTPServiceResult> => {
  try {
    const { email, otp } = data;

    // Check if user exists
    const userExist = await findByEmail({ email });

    if (!userExist) throw new Error("Unauthorized user");

    // Fetch the OTP document linked to the user
    const getOtp = await OTP.findById(userExist.otp);

    if (!getOtp) throw new Error("Invalid code");

    // Verify if the OTP code matches
    const isValidCode = await bcrypt.compare(otp, getOtp.code);
    if (!isValidCode) throw new Error("Invalid code");

    // Check if OTP is expired
    if (isOTPExpired(getOtp.expires_at)) throw new Error("OTP expired");

    // Update user, nullifying the OTP field
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { otp: null },
      { new: true }
    );

    // Delete the OTP entry after successful verification
    await OTP.findByIdAndDelete(getOtp.id);
    
    appEmitter.emit(WALLET_EVENTS.USER_CONFIRMED_OTP, updatedUser);
    
    // Return the user and generate access token
    return {
      user: updatedUser,
      token: generateAccessToken(userExist.id),
    };
  } catch (error: any) {
    console.error("Error verifying OTP:", error);
    throw new Error(error.message || "Could not verify OTP");
  }
};

/**
 * Resends a new OTP to the user's email.
 *
 * @param data - Contains the email of the user.
 * @returns An object containing the newly generated OTP.
 * @throws An error if the user is unauthorized or the process fails.
 */
export const resendOTPService = async (
  data: IResendOTP
): Promise<IResendOTPServiceResult> => {
  const { email } = data;

  const userExist = await findByEmail({ email });

  if (!userExist) throw new Error("Unauthorized user");

  const { otp, expiresAt } = generateOTP();

  const hashedCode = await hashPassword(otp);

  const otpPayload: Partial<IOtp> = {
    code: hashedCode,
    expires_at: expiresAt,
  };
  const otpId = await createOTP(otpPayload);

  const updateUser = await User.findOneAndUpdate(
    { email },
    { otp: otpId.id },
    { new: true }
  );

  const mailData: IMailData = {
    templateKey: "otpEmail",
    email: email,
    placeholders: { OTP: otp, firstname: updateUser.first_name },
    subject: "Email Verification",
  };

  await sendEMail(mailData);
  return { otp };
};
