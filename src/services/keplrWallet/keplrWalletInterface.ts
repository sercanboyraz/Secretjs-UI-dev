import { KeplrResponseDto } from "../../services/keplrWallet/dto/keplrResponseDto";

export interface KeplrWalletInterface {
  load(): Promise<KeplrResponseDto>;
  isDenomScrt(params: any): void;
  getScrt(params: any): void;
}
