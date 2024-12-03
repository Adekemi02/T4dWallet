import mongoose from "mongoose";
import { IUser } from "../models/user.model";

export interface ISignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface ICreateUserData extends ISignupPayload {
  otp: mongoose.Types.ObjectId;
}

export interface ICreateOTP {
  code: string;
  expires_at: string;
  failed_attempts?: number;
  created_at: Date;
  updated_at: Date;
}

export interface IVerifyOTP {
  email: string;
  otp: string;
}

export interface IVerifyOTPServiceResult {
  user: IUser;
  token: string;
}

export interface IResendOTPServiceResult {
  otp: string;
}

export interface IResendOTP {
  email: string;
}
