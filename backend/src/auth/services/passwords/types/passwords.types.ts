export type TForgotPasswordPayload = {
  email: string;
};

export type TForgotPasswordResponse = {
  otp: string;
  email: string;
};

export type TResetPasswordPayload = {
  otp: string;
  email: string;
  newPassword: string;
};
