import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";
import { SetWalletPinDTO } from "./wallet-pin.dto";

export class WithdrawFundDTO extends SetWalletPinDTO {
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}

export class FundWalletDTO {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsOptional()
  @MinLength(4)
  @IsString()
  description: string;
}

export class ResolveWalletDTO {
  @IsNotEmpty()
  @IsString()
  walletId: string;
}
