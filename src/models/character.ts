import { Item } from "models/item_models";
import { Shield } from "models/item_models";

class Character {
    discordId: number;
    name: string;
    stash: Item[];
    shield: Shield;

    constructor(
        discordId: number,
        name: string,
        stash: Item[],
        shield: Shield
    ) {
        this.discordId = discordId;
        this.name = name;
        this.stash = stash;
        this.shield = shield;
    }
}
