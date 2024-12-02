import {
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
  Matches,
} from "class-validator";

export class SetWalletPinDTO {
  @IsNumberString()
  @IsNotEmpty()
  @Length(4, 4)
  wallet_pin: string;
}

export class ChangeWalletPinDTO {
  @IsNumberString()
  @IsNotEmpty()
  @Length(4, 4)
  new_pin: string;

  @IsNumberString()
  @IsNotEmpty()
  @Matches(/^\d{4}$/, {
    message: "pin must be 4 digits",
  })
  @Length(4, 4)
  old_pin: string;
}
