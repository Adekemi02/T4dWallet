export interface ITransferPayload {
  receipientId: string;
  amount: number;
  description?: string;
}

export interface ITransferChargeResponse {
  newAmountWithCharge: number;
  charge: number;
}
