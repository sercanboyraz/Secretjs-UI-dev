import { Coin } from "secretjs/types/types";

export class withdrawDto {
    available_time?: number;
    receiver?: number;
    coins?: Coin;
    denom?: string;
    amount?: string;
}

