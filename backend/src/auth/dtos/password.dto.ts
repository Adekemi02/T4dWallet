import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from "class-validator";


export class ForgotPasswordDTO {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;
}

export class ResetPasswordDTO extends ForgotPasswordDTO {
  @IsNotEmpty()
  @IsString()
  otp: string;

  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 0,
  })
  @IsNotEmpty()
  @IsString()
  newPassword: string;
}

