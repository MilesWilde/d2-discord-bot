import * as ramda from "ramda";

import {
    ItemRarity,
    ItemAffixCode,
    Item,
    GearSlot,
    setItemLevel,
    adjustItemLevel,
    calculateSockets,
    calculateSuperior,
    calculateEthereal,
    calculateRequiredLevel,
    calculateRarity,
    getRequiredLevel,
} from "models/item_models";

import { getRandomInt } from "utils";

const armorDataRecord = require("d2data/armor.json") as Record<
    string,
    ArmorData
>;

export interface Armor extends Item {
    defense: number;
    strengthRequirement: number;
    maxDurability: number;
    currentDurability: number;
}

export const getArmorDataFromId = (id: string): ArmorData => {
    return armorDataRecord[id];
};

export interface ArmorData {
    expansion?: number;
    name?: string;
    version?: number;
    rarity?: number;
    spawnable?: number;
    minac?: number;
    maxac?: number;
    reqstr?: number;
    block?: number;
    durability?: number;
    level?: number;
    levelreq?: number;
    cost?: number;
    gamblecost?: number;
    code?: string;
    namestr?: string;
    autoprefix?: number;
    alternategfx?: string;
    OpenBetaGfx?: string;
    normcode?: string;
    ubercode?: string;
    ultracode?: string;
    component?: number;
    invwidth?: number;
    invheight?: number;
    hasinv?: number;
    gemsockets?: number;
    gemapplytype?: number;
    flippyfile?: string;
    invfile: string;
    type?: string;
    dropsound?: string;
    dropsfxframe?: number;
    usesound?: string;
    transtbl?: number;
    lightradius?: number;
    durwarning?: number;
    mindam?: number;
    maxdam?: number;
    StrBonus?: number;
    bitfield1?: number;
    CharsiMagicLvl?: number;
    GheedMagicLvl?: number;
    AkaraMagicLvl?: number;
    FaraMagicLvl?: number;
    LysanderMagicLvl?: number;
    DrognanMagicLvl?: number;
    HratliMagicLvl?: number;
    AlkorMagicLvl?: number;
    OrmusMagicLvl?: number;
    ElzixMagicLvl?: number;
    AshearaMagicLvl?: number;
    CainMagicLvl?: number;
    HalbuMagicLvl?: number;
    JamellaMagicLvl?: number;
    LarzukMagicLvl?: number;
    MalahMagicLvl?: number;
    DrehyaMagicLvl?: number;
    NightmareUpgrade?: string;
    HellUpgrade?: string;
    nameable?: number;
}

export const addArmorAffixCode = <T extends Armor>(armor: T): T => {
    return {
        ...armor,
        itemAffixCodes: armor.itemAffixCodes
            ? armor.itemAffixCodes.concat(ItemAffixCode.Armor)
            : [ItemAffixCode.Armor],
    };
};

export const calculateDefense = (armorData: ArmorData) => {
    var newDefense = getRandomInt(
        armorData.minac as number,
        armorData.maxac as number
    );
    return <T extends Armor>(armor: T): T => {
        return {
            ...armor,
            defense: newDefense,
        };
    };
};

export const setArmorDurability = (armorData: ArmorData) => {
    var durability = armorData.durability;
    return <T extends Armor>(armor: T): T => {
        return {
            ...armor,
            maxDurability: durability,
            currentDurability: durability,
        };
    };
};

export const setArmorStrengthRequirement = (armorData: ArmorData) => {
    var strengthRequirement = armorData.reqstr;
    return <T extends Armor>(armor: T): T => {
        return {
            ...armor,
            strengthRequirement: strengthRequirement,
        };
    };
};

export const setArmorBaseName = (armorData: ArmorData) => {
    var name = armorData.name;
    return <T extends Armor>(armor: T): T => {
        return {
            ...armor,
            name: name,
        };
    };
};

export const calculateArmorRequiredLevel = (armorData: ArmorData) => {
    return <T extends Item>(item: T): T => {
        return {
            ...item,
            requiredLevel: armorData.levelreq,
        };
    };
};

export const createNewArmorBaseData = (armorData: ArmorData) => {
    return ramda.pipe(
        calculateDefense(armorData),
        setArmorDurability(armorData),
        setArmorStrengthRequirement(armorData),
        setArmorBaseName(armorData),
        calculateArmorRequiredLevel(armorData),
        addArmorAffixCode,
        calculateEthereal
    );
};

// const armorData = {} as ArmorData;
// const newArmor = createNewArmorDataBase(armorData);
// const armor = {} as Armor;
// const createdArmor = newArmor(armor);
