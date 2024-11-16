import { IsNotEmpty, IsNumber, IsOptional, MinLength, IsString } from "class-validator";

export class TransferFundsDTO {
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