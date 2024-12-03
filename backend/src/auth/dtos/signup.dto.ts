import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
} from "class-validator";

export class SignupDTO {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 0,
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class VerifyOTPDTO {
  @IsNotEmpty()
  @IsString()
  email: string;

  @Length(6, 6)
  @IsNotEmpty()
  @IsString()
  otp: string;
}

export class ResendOTPDTO {
  @IsNotEmpty()
  @IsString()
  email: string;
}
