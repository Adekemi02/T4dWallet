export const entitityCodePrefixes = {
  USER: "USER-",
  WALLET: "WAL-",
  TRANSACTION_REF: "TXN-",
};

export interface IOTPResponse {
  otp: string;
  expiresAt: Date;
}

export interface ISignupMail {
  email: string;
  otp: string;
  firstName: string;
}

export interface IForgotPasswordMail {
  email: string;
  otp: string;
  expiresAt: Date;
  // firstName: string;
}

export interface DecodedToken {
  userid: string;
  role: string;
  exp: number;
}
