import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class NewBeneficiaryDTO {
  @IsNotEmpty()
  @IsString()
  walletId: string;

  @IsOptional()
  @MaxLength(15)
  @IsString()
  alias: string;
}

export class GetOneBeneficiaryDTO {
  @IsNotEmpty()
  @IsString()
  beneficiaryId: string;
}

export class SearchBeneficiariesDTO {
  @IsString()
  @IsNotEmpty({ message: "Search query must not be empty" })
  query: string;
}
