import { withdrawDto } from "./withdrawDto"

export class ClaimsDto {
    withdraw?: withdrawDto;
    ready_for_claim?: boolean;
    in_current_window?: boolean;
}

