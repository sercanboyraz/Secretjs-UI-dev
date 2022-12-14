import { SigningCosmWasmClient } from "secretjs";
import { ClaimsDto } from "./claimsDto";

export class KeplrResponseDto {
    address?: string;
    balance?: number;
    balanceString?: string;
    exchangeRate?: number;
    secretInstance?: SigningCosmWasmClient;
    networkBalance?: number;
    transactionFee?: string;
    claims?: ClaimsDto[];
    viewingKey?: any;
    totalStaked?: number;
}

