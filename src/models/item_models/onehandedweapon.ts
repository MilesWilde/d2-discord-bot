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
    Weapon,
    createNewWeaponBaseData,
    WeaponData,
} from "models/item_models";

import { ImageDescription } from "utils";

export interface OneHandedWeapon extends Weapon {
    oneHandMinimumDamage: number;
    oneHandMaximumDamage: number;
    speed: number;
    weaponSpeed: string;
}

export function CreateOneHandedWeaponImageDescription(weapon: OneHandedWeapon) {
    var nameImageDescription: ImageDescription = {
        colour: HexItemColor.White,
        text: weapon.name,
    };
    if (weapon.rarity == ItemRarity.Magic) {
        nameImageDescription.colour = HexItemColor.Magic;
    }

    const imageDescriptionList: ImageDescription[] = [
        nameImageDescription,
        {
            colour: HexItemColor.White,
            text: `One-Hand Damage: ${weapon.oneHandMinimumDamage} To ${weapon.oneHandMaximumDamage}`,
        },
        {
            colour: HexItemColor.White,
            text: `Durability: ${weapon.currentDurability} of ${weapon.maxDurability}`,
        },
    ];
    if (weapon.strengthRequirement) {
        imageDescriptionList.push({
            colour: HexItemColor.White,
            text: `Required Strength:  ${weapon.strengthRequirement}`,
        });
    }
    if (weapon.dexterityRequirement) {
        imageDescriptionList.push({
            colour: HexItemColor.White,
            text: `Required Dexterity:  ${weapon.dexterityRequirement}`,
        });
    }
    if (weapon.requiredLevel != 1) {
        imageDescriptionList.push({
            colour: HexItemColor.White,
            text: `Required Level: ${weapon.requiredLevel}`,
        });
    }

    // attack speed needs to be calculated as Very Slow/Slow/Normal/Fast/Very Fast
    // attack speed string also needs to be modifiable to be blue in case it is modified
    imageDescriptionList.push({
        colour: HexItemColor.White,
        text: `${weapon.weaponClass} Class - ${weapon.weaponSpeed} Attack Speed}`,
    });

    weapon.affixes.forEach((affix) => {
        affix.modifiers.forEach((modifier) => {
            imageDescriptionList.push({
                colour: nameImageDescription.colour,
                text: modifier.description,
            });
        });
    });

    return imageDescriptionList;
}

const setWeaponDamage = (weaponData: WeaponData) => {
    return (weapon: OneHandedWeapon): OneHandedWeapon => {
        return {
            ...weapon,
            oneHandMinimumDamage: weaponData.mindam,
            oneHandMaximumDamage: weaponData.maxdam,
        };
    };
};

export const createOneHandedWeaponBase = (weaponData: WeaponData) => {
    return ramda.pipe(
        setWeaponDamage(weaponData),
        createNewWeaponBaseData(weaponData),
        calculateRarity(100),
        calculateSockets,
        calculateSuperior
    );
};
