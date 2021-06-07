import { ItemRarity, GearSlot, Armor, ItemDataType } from "models/item_models";
import { HexItemColor } from "models/item_models";
import { ItemAffixCode } from "models/item_models/item";
import { ImageDescription } from "utils";

export interface Shield extends Armor {
    chanceToBlock: number;
}
//     constructor(
//         itemLevel: number,
//         requiredLevel: number,
//         rarity: ItemRarity,
//         maxNumberOfSockets: number,
//         ownerDiscordId: string,
//         name: string,
//         defense: number,
//         strengthRequirement: number,
//         chanceToBlock: number
//     ) {
//         super(
//             itemLevel,
//             requiredLevel,
//             rarity,
//             maxNumberOfSockets,
//             ownerDiscordId,
//             name,
//             defense,
//             strengthRequirement,
//             maxDurability,
//             currentDurability
//         );
//         this.maxDurability = this.maxDurability;

//         this.currentDurability = this.currentDurability;

//         this.armorDataCode = ArmorDataCode.Shield;

//         this.gearSlot = GearSlot.Shield;

//         this.itemAffixCodes.push(ItemAffixCode.Shield);

//         this.chanceToBlock = chanceToBlock;
//     }

//     CreateImageDescription() {
//         var nameImageDescription: ImageDescription = {
//             colour: Color.White,
//             text: this.name,
//         };
//         if (this.rarity == ItemRarity.Magic) {
//             nameImageDescription.colour = Color.Magic;
//         }

//         const imageDescriptionList: ImageDescription[] = [
//             nameImageDescription,
//             {
//                 colour: Color.White,
//                 text: `Defense: ${this.defense}`,
//             },
//             {
//                 colour: Color.White,
//                 text: `Chance to Block: ${this.chanceToBlock}%`,
//             },
//             {
//                 colour: Color.White,
//                 text: `Required Strength:  ${this.strengthRequirement}`,
//             },
//         ];

//         if (this.requiredLevel != 1) {
//             imageDescriptionList.push({
//                 colour: Color.White,
//                 text: `Required Level: ${this.requiredLevel}`,
//             });
//         }

//         this.modifiers.forEach((modifier) => {
//             imageDescriptionList.push({
//                 colour: nameImageDescription.colour,
//                 text: modifier.description,
//             });
//         });

//         return imageDescriptionList;
//     }
// }
