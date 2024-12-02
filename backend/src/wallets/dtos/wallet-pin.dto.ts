import { IsNotEmpty, IsString } from "class-validator";

export class SetWalletPinDTO {
     @IsNotEmpty()
     @IsString()
     wallet_pin: string;
   }