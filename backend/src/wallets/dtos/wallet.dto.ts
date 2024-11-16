import { IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class CreditWalletDTO {
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