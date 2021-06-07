import * as ramda from "ramda";
import { getRandomInt } from "utils";
let prefixes = require("d2data/MagicPrefixesNew.json") as Affix[];
let suffixes = require("d2data/MagicSuffixesNew.json") as Affix[];

export const enum HexItemColor {
    Magic = `#5050ac`,
    White = `#c4c4c4`,
    // Rare ,
    // Unique ,
    // Crafted
}

export const enum AffixType {
    Suffix,
    Prefix,
}

export const enum ItemRarity {
    Unique = "Unique",
    Rare = "Rare",
    Magic = "Magic",
    White = "White",
    Crafted = "Crafted",
}

export const enum GearSlot {
    Amulet = "amulet",
    Belt = "belt",
    BodyArmor = "bodyArmor",
    Boots = "boots",
    Gloves = "gloves",
    Helm = "helm",
    Ring = "ring",
    Shield = "shld",
    Weapon = "weap",
}

export const enum ItemAffixCode {
    Amulet = "amulet",
    Armor = "armo",
    Belt = "belt",
    BodyArmor = "tors",
    Boots = "boot",
    Gloves = "glov",
    Helm = "helm",
    Ring = "ring",
    Shield = "shld",
    Weapon = "weap",
    Pelt = "pelt",
    BarbarianHelm = "phlm",
    DruidHelm = "pelt",
    PaladinShield = "ashd",
    NecromancerShield = "head",
    Circlet = "circ",
    Axe = "axe",
    Wand = "wand",
    Club = "club",
    Scepter = "scep",
    Mace = "mace",
    Hammer = "hamm",
    Sword = "swor",
    Knife = "knif",
    ThrowingKnife = "tkni",
    ThrowingAxe = "taxe",
    Javelin = "jave",
    Spear = "spea",
    Polearm = "pole",
    Staff = "staf",
    Bow = "bow",
    Crossbow = "xbow",
    ThrowingPotion = "tpot",
    AssassinWeapon1 = "h2h",
    AssassinWeapon2 = "h2h2",
    SorceressOrb = "orb",
    MissileWeapon = "miss",
}

export const enum ItemDataType {
    Amulet = "amulet",
    Belt = "belt",
    BodyArmor = "tors",
    Boots = "boot",
    Gloves = "gloves",
    Helm = "helm",
    Ring = "ring",
    Shield = "shie",
    Weapon = "weap",
    BarbarianHelm = "phlm",
    DruidHelm = "pelt",
    PaladinShield = "ashd",
    NecromancerShield = "head",
    Circlet = "circ",
    AmazonBow = "abow",
    AmazonSpear = "aspe",
    AmazonJavelin = "ajav",
}

interface Modifier {
    code: string;
    min: number;
    max: number;
    description: string;
}

export interface Affix {
    expansion?: number;
    name: string;
    version: number;
    spawnable: number;
    rare: number;
    level: number;
    levelreq: number;
    frequency: number;
    group: number;
    modifiers: Modifier[];
    transform: number;
    transformcolor: string;
    includedItemTypes: string[];
    excludedItemTypes: string[];
}

export interface Item {
    itemLevel: number;
    requiredLevel: number;
    rarity: ItemRarity;
    ethereal: boolean;
    maxNumberOfSockets: number;
    sockets?: number;
    superior?: boolean;
    ownerDiscordId: string;
    name: string;
    affixes: Affix[];
    gearSlot: GearSlot;
    itemAffixCodes: ItemAffixCode[];
}

const enum MagicRandomizerPossibilities {
    PrefixOnly = 1,
    PrefixAndSuffix = 2,
}

export const setItemLevel = (monsterLevel: number) => {
    return <T extends Item>(item: T) => {
        return {
            ...item,
            itemLevel: monsterLevel,
        };
    };
};

export const adjustItemLevel = <T extends Item>(item: T): T =>
    ramda.assoc(
        "itemLevel",
        item.itemLevel - 5 + Math.floor(Math.random() * 11)
    )(item);

// calculateSockets = <T extends Item>(item: T) ramda.assoc('sockets', ramda.ifElse(Math.random() > 0.9, ))
export const calculateSockets = <T extends Item>(item: T): T => {
    var sockets = 0;
    if (item.rarity == ItemRarity.White) {
        sockets =
            Math.random() > 0.9
                ? item.maxNumberOfSockets -
                  Math.floor(item.maxNumberOfSockets * Math.random())
                : 0;
    }
    return {
        ...item,
        sockets: sockets,
    };
};

export const calculateSuperior = <T extends Item>(item: T): T => {
    var superior = false;
    if (item.rarity == ItemRarity.White) {
        superior = Math.random() > 0.9 ? true : false;
    }
    return {
        ...item,
        superior: superior,
    };
};

// can also do calculateEthereal = ramda.assoc('ethereal', Math.random() > 0.9 ? true : false)
export const calculateEthereal = <T extends Item>(item: T): T => {
    return {
        ...item,
        ethereal: Math.random() > 0.9,
    };
};

// perhaps this should take an Armor/WeaponData and
export const calculateRequiredLevel = <T extends Item>(item: T) => {
    var modifierLevelRequirements = item.affixes.map(
        (modifier) => modifier.levelreq
    );
    return {
        ...item,
        requiredLevel: item.requiredLevel
            ? Math.max(...modifierLevelRequirements, item.requiredLevel)
            : Math.max(...modifierLevelRequirements),
    };
};

// needs to take in a magic find value, and then roll based on this

export const calculateRarity = (magicFind: number) => {
    var rolledRarity = ItemRarity.Magic;
    // var rolledRarity = ItemRarity.White;
    // var rarityRoll = Math.random();
    // if (rarityRoll > 0.3 && rarityRoll < 0.6) {
    //     rolledRarity = ItemRarity.Magic;
    // } else if (rarityRoll >= 0.6) {
    //     rolledRarity = ItemRarity.Magic;
    // }
    return function <T extends Item>(item: T) {
        return {
            ...item,
            rarity: rolledRarity,
        };
    };
};

export const getRequiredLevel = ramda.propOr(1, "levelreq") as <T extends Item>(
    item: T
) => number;

export const rollMagicItem = <T extends Item>(item: T) => {
    let possibility = getRandomInt(1, 4);

    if (possibility == MagicRandomizerPossibilities.PrefixOnly) {
        return attachRandomPrefix(item);
    } else if (possibility == MagicRandomizerPossibilities.PrefixAndSuffix) {
        return attachSuffixAndPrefix(item);
    } else {
        return attachRandomSuffix(item);
    }
};

export const attachRandomPrefix = <T extends Item>(item: T): T => {
    let newAffix = getAffix(prefixes, item);

    newAffix.modifiers = newAffix.modifiers.map((modifier, index) => {
        return {
            ...modifier,
            description: modifier.description.replace(
                `#d${index + 1}`,
                `${getRandomInt(modifier.min, modifier.max)}`
            ),
        };
    });

    let newAffixes = item.affixes ? item.affixes : [];

    newAffixes.push(newAffix);

    let newName = `${newAffix.name} ${item.name}`;

    return {
        ...item,
        name: newName,
        affixes: newAffixes,
    };
};

export const attachRandomSuffix = <T extends Item>(item: T): T => {
    let newAffix = getAffix(suffixes, item);

    newAffix.modifiers = newAffix.modifiers.map((modifier, index) => {
        return {
            ...modifier,
            description: modifier.description.replace(
                `#d${index + 1}`,
                `${getRandomInt(modifier.min, modifier.max)}`
            ),
        };
    });

    let newAffixes = item.affixes ? item.affixes : [];

    newAffixes.push(newAffix);

    let newName = `${item.name} ${newAffix.name}`;

    return {
        ...item,
        name: newName,
        affixes: newAffixes,
    };
};

export const attachSuffixAndPrefix = ramda.pipe(
    attachRandomPrefix,
    attachRandomSuffix
);

export const getAffix = <T extends Item>(affixes: Affix[], item: T): Affix => {
    let affix: Affix | undefined;

    while (!affix) {
        let affixPosition = getRandomInt(0, affixes.length);
        let potentialAffix = affixes[affixPosition];

        if (
            item.itemAffixCodes.some(
                potentialAffix.includedItemTypes.includes
            ) &&
            item.itemAffixCodes.every(
                ramda.complement(potentialAffix.excludedItemTypes.includes)
            )
        ) {
            affix = potentialAffix;
        }
    }

    return affix;
};
