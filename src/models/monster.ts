import { TreasureClass, getTreasureClassFromId } from "models";
import { getRandomInt } from "utils";

import * as ramda from "ramda";

var monsterData = require("d2data/monstatsNew.json") as Record<
    string,
    MonsterData
>;

export enum Difficulty {
    Normal,
    Nightmare,
    Hell,
}

export interface Monster {
    name: string;
    difficulty: Difficulty;
    treasureClasses: TreasureClass[];
    minions?: Monster[];
    PartyMin?: number;
    PartyMax?: number;
    GroupMin?: number;
    GroupMax?: number;
    rarity?: number;
}

interface MonsterData {
    Id: string;
    BaseId: string;
    NextInClass: string;
    NameStr: string;
    MonStatsEx: string;
    MonType: string;
    AI: string;
    Code: string;
    MonSound: string;
    UMonSound: string;
    Skill1: string;
    Sk1mode: string;
    hcIdx: number;
    enabled: number;
    PartyMin: number;
    PartyMax: number;
    MinGrp: number;
    minions: string[];
    MaxGrp: number;
    Velocity: number;
    Run: number;
    Rarity: number;
    threat: number;
    isSpawn: number;
    isMelee: number;
    lUndead: number;
    opendoors: number;
    killable: number;
    switchai: number;
    zoo: number;
    Sk1lvl: number;
    DamageRegen: number;
    Crit: number;
    minHP: number;
    maxHP: number;
    monsterDifficultyVariables: {
        normal: MonsterDifficultyVariables;
        hell: MonsterDifficultyVariables;
        nightmare: MonsterDifficultyVariables;
    };
}

interface MonsterDifficultyVariables {
    treasureClasses: string[];
    Level: number;
    aidel: number;
    aip1: number;
    aip2: number;
    aip3: number;
    aip4: number;
    coldeffect: number;
    ResDm: number;
    ResLi: number;
    ResPo: number;
    ToBlock: number;
    MinHP: number;
    MaxHP: number;
    AC: number;
    Exp: number;
    A1MinD: number;
    A1MaxD: number;
    A1TH: number;
    A2MinD: number;
    A2MaxD: number;
    A2TH: number;
}

const getNormalTreasureClassIds = (monsterData: MonsterData) => {
    return monsterData.monsterDifficultyVariables.normal.treasureClasses;
};

const getNightmareTreasureClassIds = (monsterData: MonsterData) => {
    return monsterData.monsterDifficultyVariables.nightmare.treasureClasses;
};

const getHellTreasureClassIds = (monsterData: MonsterData) => {
    return monsterData.monsterDifficultyVariables.hell.treasureClasses;
};

const getTreasureClassesFromIds = (treasureClassIds: string[]) => {
    return treasureClassIds.map((treasureClassId) =>
        getTreasureClassFromId(treasureClassId)
    );
};

const setMonsterName = (monsterData: MonsterData) => {
    return (monster: Monster): Monster => {
        return {
            ...monster,
            name: monsterData.NameStr,
        };
    };
};

export const getMonsterGroupSize = (monsterData: MonsterData) => {
    if (monsterData.MinGrp && monsterData.MaxGrp) {
        return getRandomInt(monsterData.MinGrp, monsterData.MaxGrp);
    } else if (monsterData.MaxGrp) {
        return getRandomInt(0, monsterData.MaxGrp);
    }
};

export const getMonsterPartySize = (monsterData: MonsterData) => {
    if (monsterData.PartyMin && monsterData.PartyMax) {
        return getRandomInt(monsterData.PartyMin, monsterData.PartyMax);
    } else if (monsterData.PartyMax) {
        return getRandomInt(0, monsterData.PartyMax);
    }
};

const setMonsterMinions = (monsterData: MonsterData) => {
    var minions: Monster[] | undefined = [];

    return (monster: Monster): Monster => {
        // makes sure monster has minions, and that the minion isn't equal to itself (causing infinite loop)
        minions =
            monsterData.minions && !monsterData.minions.includes(monsterData.Id)
                ? monsterData.minions.map((minionId) =>
                      createMonster(minionId, monster.difficulty)
                  )
                : undefined;
        return {
            ...monster,
            minions: minions,
        };
    };
};

const setMonsterDifficulty = (difficulty: Difficulty) => {
    return (monster: Monster): Monster => {
        return {
            ...monster,
            difficulty: difficulty,
        };
    };
};

const setMonsterRarity = (monsterData: MonsterData) => {
    return (monster: Monster): Monster => {
        return {
            ...monster,
            rarity: monsterData.Rarity,
        };
    };
};

const setMonsterGroupMinMax = (monsterData: MonsterData) => {
    return (monster: Monster): Monster => {
        return {
            ...monster,
            GroupMin: monsterData.MinGrp,
            GroupMax: monsterData.MaxGrp,
        };
    };
};

const setMonsterPartyMinMax = (monsterData: MonsterData) => {
    return (monster: Monster): Monster => {
        return {
            ...monster,
            PartyMin: monsterData.PartyMin,
            PartyMax: monsterData.PartyMax,
        };
    };
};

const setMonsterTreasureClasses = (monsterData: MonsterData) => {
    return (monster: Monster): Monster => {
        var treasureClasses = [];
        if (monster.difficulty == Difficulty.Normal) {
            treasureClasses = getTreasureClassesFromIds(
                getNormalTreasureClassIds(monsterData)
            );
        } else if (monster.difficulty == Difficulty.Nightmare) {
            treasureClasses = getTreasureClassesFromIds(
                getNightmareTreasureClassIds(monsterData)
            );
        } else {
            treasureClasses = getTreasureClassesFromIds(
                getHellTreasureClassIds(monsterData)
            );
        }
        return {
            ...monster,
            treasureClasses: treasureClasses,
        };
    };
};

export const createMonsterBase = (
    monsterData: MonsterData,
    difficulty: Difficulty
) => {
    return ramda.pipe(
        setMonsterDifficulty(difficulty),
        setMonsterMinions(monsterData),
        setMonsterName(monsterData),
        setMonsterRarity(monsterData),
        setMonsterGroupMinMax(monsterData),
        setMonsterPartyMinMax(monsterData),
        setMonsterTreasureClasses(monsterData)
    );
};

export const getMonsterDataFromId = (id: string) => {
    return monsterData[id];
};

export const createMonster = (id: string, difficulty: Difficulty) => {
    var monsterData = getMonsterDataFromId(id);
    var monsterBase = createMonsterBase(monsterData, Difficulty.Hell);
    var monster = {} as Monster;
    monster = monsterBase(monster);
    return monster;
};

// testMonster();
function testMonster() {
    var monsterId = "fallen1";
    var monsterData = getMonsterDataFromId(monsterId);
    var monsterBase = createMonsterBase(monsterData, Difficulty.Hell);
    var monster = {} as Monster;
    monster = monsterBase(monster);
    console.log(monster);
}
