import * as ramda from "ramda";

import {
    ItemRarity,
    ItemAffixCode,
    Armor,
    ItemDataType,
    GearSlot,
    setItemLevel,
    adjustItemLevel,
    calculateSockets,
    calculateSuperior,
    calculateEthereal,
    calculateRequiredLevel,
    calculateRarity,
    getRequiredLevel,
    HexItemColor,
    createNewArmorBaseData,
    ArmorData,
} from "models/item_models";
import { ImageDescription } from "utils";

export function CreateHelmImageDescription<T extends Armor>(helm: T) {
    var nameImageDescription: ImageDescription = {
        colour: HexItemColor.White,
        text: helm.name,
    };
    if (helm.rarity == ItemRarity.Magic) {
        nameImageDescription.colour = HexItemColor.Magic;
    }

    const imageDescriptionList: ImageDescription[] = [
        nameImageDescription,
        {
            colour: HexItemColor.White,
            text: `Defense: ${helm.defense}`,
        },
        {
            colour: HexItemColor.White,
            text: `Durability: ${helm.currentDurability} of ${helm.maxDurability}`,
        },
        {
            colour: HexItemColor.White,
            text: `Required Strength:  ${helm.strengthRequirement}`,
        },
    ];

    if (helm.requiredLevel != 1) {
        imageDescriptionList.push({
            colour: HexItemColor.White,
            text: `Required Level: ${helm.requiredLevel}`,
        });
    }

    helm.affixes.forEach((affix) => {
        affix.modifiers.forEach((modifier) => {
            imageDescriptionList.push({
                colour: nameImageDescription.colour,
                text: modifier.description,
            });
        });
    });

    return imageDescriptionList;
}

export const addHelmAffixCode = (armorData: ArmorData) => {
    return <T extends Armor>(helm: T): T => {
        return {
            ...helm,
            itemAffixCodes: helm.itemAffixCodes
                ? helm.itemAffixCodes.concat(armorData.type as ItemAffixCode)
                : [ItemAffixCode.Helm, armorData.type as ItemAffixCode],
        };
    };
};

export const createHelmBase = (armorData: ArmorData) => {
    return ramda.pipe(
        addHelmAffixCode(armorData),
        createNewArmorBaseData(armorData),
        calculateRarity(100),
        calculateSockets,
        calculateSuperior
    );
};
