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

import * as ramda from "ramda";

const weaponDataRecord = require("d2data/weapons.json") as Record<
    string,
    WeaponData
>;

export const getWeaponDataFromId = (id: string): WeaponData => {
    return weaponDataRecord[id];
};

export const enum WeaponClass {
    Sword = "Sword",
    Mace = "Mace",
    Staff = "Staff",
    Bow = "Bow",
    Crossbow = "Crossbow",
    Axe = "Axe",
    Javelin = "Javelin",
    Dagger = "Dagger",
    Polearm = "Polearm",
    Spear = "Spear",
    Claw = "Claw",
}

export interface WeaponData {
    name: string;
    type: string;
    code: string;
    alternateGfx: string;
    namestr: string;
    OpenBetaGfx: string;
    normcode: string;
    ubercode: string;
    ultracode: string;
    wclass: string;
    "2handedwclass": string;
    "hit class": string;
    flippyfile: string;
    invfile: string;
    uniqueinvfile: string;
    setinvfile: string;
    dropsound: string;
    usesound: string;
    NightmareUpgrade: string;
    HellUpgrade: string;
    "2handed": number;
    rarity: number;
    spawnable: number;
    mindam: number;
    maxdam: number;
    minmisdam: number;
    maxmisdam: number;
    "2handmindam": number;
    "2handmaxdam": number;
    rangeadder: number;
    speed: number;
    StrBonus: number;
    DexBonus: number;
    reqstr: number;
    durability: number;
    level: number;
    levelreq: number;
    cost: number;
    "gamble cost": number;
    "1or2handed": number;
    component: number;
    invwidth: number;
    invheight: number;
    hasinv: number;
    gemsockets: number;
    dropsfxframe: number;
    transtbl: number;
    durwarning: number;
    bitfield1: number;
    CharsiMin: number;
    CharsiMax: number;
    CharsiMagicMin: number;
    CharsiMagicMax: number;
    CharsiMagicLvl: number;
    GheedMin: number;
    GheedMax: number;
    GheedMagicMin: number;
    GheedMagicMax: number;
    GheedMagicLvl: number;
    AkaraMagicLvl: number;
    FaraMagicLvl: number;
    LysanderMagicLvl: number;
    DrognanMagicLvl: number;
    HratliMagicLvl: number;
    AlkorMagicLvl: number;
    OrmusMagicLvl: number;
    ElzixMin: number;
    ElzixMax: number;
    ElzixMagicMin: number;
    ElzixMagicMax: number;
    ElzixMagicLvl: number;
    AshearaMagicLvl: number;
    CainMagicLvl: number;
    HalbuMagicLvl: number;
    JamellaMagicLvl: number;
    LarzukMagicLvl: number;
    DrehyaMagicLvl: number;
    MalahMagicLvl: number;
    Transform: number;
    InvTrans: number;
    Nameable: number;
    reqdex: number;
}

export interface Weapon extends Item {
    strengthRequirement: number;
    dexterityRequirement: number;
    maxDurability: number;
    currentDurability: number;
    weaponClass: WeaponClass;
}

export const setWeaponDurability = (weaponData: WeaponData) => {
    var durability = weaponData.durability;
    return <T extends Weapon>(weapon: T): T => {
        return {
            ...weapon,
            maxDurability: durability,
            currentDurability: durability,
        };
    };
};

export const setWeaponClass = (weaponData: WeaponData) => {
    var weaponClass: WeaponClass;

    if (["axe", "taxe"].includes(weaponData.type)) {
        weaponClass = WeaponClass.Axe;
    } else if (["club", "scep", "mace", "hamm"].includes(weaponData.type)) {
        weaponClass = WeaponClass.Mace;
    } else if (["swor"].includes(weaponData.type)) {
        weaponClass = WeaponClass.Sword;
    } else if (["jave", "ajav"].includes(weaponData.type)) {
        weaponClass = WeaponClass.Javelin;
    } else if (["aspe", "spea"].includes(weaponData.type)) {
        weaponClass = WeaponClass.Spear;
    } else if (["orb", "staf", "wand"].includes(weaponData.type)) {
        weaponClass = WeaponClass.Staff;
    } else if (["knif", "tkni"].includes(weaponData.type)) {
        weaponClass = WeaponClass.Dagger;
    } else if (["pole"].includes(weaponData.type)) {
        weaponClass = WeaponClass.Polearm;
    } else if (["h2h", "h2h2"].includes(weaponData.type)) {
        weaponClass = WeaponClass.Claw;
    } else if (["bow", "abow"].includes(weaponData.type)) {
        weaponClass = WeaponClass.Bow;
    } else if (["tpot"].includes(weaponData.type)) {
        //do nothing
    } else {
        weaponClass = WeaponClass.Crossbow;
    }
    return <T extends Weapon>(weapon: T): T => {
        return {
            ...weapon,
            weaponClass: weaponClass,
        };
    };
};

export const setWeaponStrengthRequirement = (weaponData: WeaponData) => {
    var strengthRequirement = weaponData.reqstr;
    return <T extends Weapon>(weapon: T): T => {
        return {
            ...weapon,
            strengthRequirement: strengthRequirement,
        };
    };
};

export const setDexterityRequirement = (weaponData: WeaponData) => {
    var dexterityRequirement = weaponData.reqdex;
    return <T extends Weapon>(weapon: T): T => {
        return {
            ...weapon,
            setDexterityRequirement: dexterityRequirement,
        };
    };
};

export const setWeaponBaseName = (weaponData: WeaponData) => {
    var name = weaponData.name;
    return <T extends Weapon>(weapon: T): T => {
        return {
            ...weapon,
            name: name,
        };
    };
};

export const calculateWeaponRequiredLevel = (weaponData: WeaponData) => {
    return <T extends Item>(item: T): T => {
        return {
            ...item,
            requiredLevel: weaponData.levelreq,
        };
    };
};

const addWeaponAffixCode = (weaponData: WeaponData) => {
    return <T extends Weapon>(weapon: T): T => {
        return {
            ...weapon,
            itemAffixCodes: [
                ItemAffixCode.Weapon,
                weaponData.type as ItemAffixCode,
            ],
        };
    };
};

const setWeaponSpeed = (weaponData: WeaponData) => {
    let weaponSpeed = "";

    if (weaponData.speed < -0.15) {
        weaponSpeed = "Very Slow";
    } else if (weaponData.speed < -0.05) {
        weaponSpeed = "Slow";
    } else if (weaponData.speed < 0.05) {
        weaponSpeed = "Normal";
    } else if (weaponData.speed < 0.15) {
        weaponSpeed = "Fast";
    } else {
        weaponSpeed = "Very Fast";
    }

    return <T extends Weapon>(weapon: T): T => {
        return {
            ...weapon,
            speed: weaponSpeed,
        };
    };
};

export const createNewWeaponBaseData = (weaponData: WeaponData) => {
    return ramda.pipe(
        setWeaponClass(weaponData),
        setWeaponDurability(weaponData),
        setWeaponStrengthRequirement(weaponData),
        setDexterityRequirement(weaponData),
        setWeaponBaseName(weaponData),
        calculateWeaponRequiredLevel(weaponData),
        addWeaponAffixCode(weaponData),
        setWeaponSpeed(weaponData)
    );
};
