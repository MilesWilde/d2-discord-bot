import { option as O } from "fp-ts";

export interface Gold {
    amount: number;
    level: number;
    multiplier: O.Option<number>;
}
