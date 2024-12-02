import { IsEnum, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class NewBeneficiaryDTO {
  @IsNotEmpty()
  @IsString()
  walletId: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
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
