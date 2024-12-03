import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MinLength,
  IsString,
} from "class-validator";
import { SetWalletPinDTO } from "./wallet-pin.dto";

export class TransferFundsDTO extends SetWalletPinDTO {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @MinLength(4)
  @IsString()
  receipientId: string;

  @IsOptional()
  @MinLength(4)
  @IsString()
  description: string;
}
