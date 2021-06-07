import * as ramda from "ramda";
import { Difficulty, Monster, createMonster } from "models";
import { ArmorData, WeaponData, MiscData } from "models/item_models";
import { getRandomInt } from "utils";
var levelData = require("d2data/LevelsNew.json") as Record<string, LevelData>;

const shuffler = ramda.curry(function (random, list) {
        var idx = -1;
        var len = list.length;
        var position;
        var result: string[] = [];
        while (++idx < len) {
            position = Math.floor((idx + 1) * random());
            result[idx] = result[position];
            result[position] = list[idx];
        }
        return result;
    }),
    shuffle = shuffler(Math.random);

export interface Level {
    difficulty: Difficulty;
    name: string;
    monsterIds: string[];
    totalMonsterPacks: number;
    monsterAmounts: {
        monster: Monster;
        amount: number;
        minionAmount: number;
    }[];
    totalUniquePacks: number;
    uniqueIdPackAmounts: { monsterId: string; amountOfPacks: number }[];
    zoneMonsterLevel: number;
}

interface LevelData {
    Name: string;
    NormalMonsters: string[];
    NightmareAndHellMonsters: string[];
    UniqueMonsters: string[];
    Critters: string[];
    CritterSpawnPercentages: number[];
    LevelName: string;
    LevelWarp: string;
    EntryFile: string;
    Id: number;
    Pal: number;
    Act: number;
    QuestFlag: number;
    QuestFlagEx: number;
    Layer: number;
    SizeX: number;
    SizeY: number;
    "SizeX(N)": number;
    "SizeY(N)": number;
    "SizeX(H)": number;
    "SizeY(H)": number;
    OffsetX: number;
    OffsetY: number;
    Teleport: number;
    LOSDraw: number;
    FloorFilter: number;
    BlankScreen: number;
    IsInside: number;
    DrlgType: number;
    LevelType: number;
    SubType: number;
    SubTheme: number;
    SubWaypoint: number;
    SubShrine: number;
    VisList: number[];
    Warps: number[];
    Red: number;
    Green: number;
    Blue: number;
    SaveMonsters: number;
    WarpDist: number;
    MonsterLevels: number[];
    MonsterLevelsExpansion: number[];
    MonDen: number;
    "MonDen(N)": number;
    "MonDen(H)": number;
    MonUMin: number;
    MonUMax: number;
    "MonUMin(N)": number;
    "MonUMax(N)": number;
    "MonUMin(H)": number;
    "MonUMax(H)": number;
    MonWndr: number;
    NumMon: number;
    Themes: number;
    SoundEnv: number;
    Waypoint: number;
    ObjectGroups: number[];
    ObjectProbabilities: number[];
}

export const getLevelDataFromName = (name: string) => {
    return levelData[name];
};

const setDifficulty = (difficulty: Difficulty) => {
    return (level: Level) => {
        return {
            ...level,
            difficulty: difficulty,
        };
    };
};

const setLevelName = (levelData: LevelData) => {
    return (level: Level): Level => {
        return {
            ...level,
            name: levelData.LevelName,
        };
    };
};

const calculateMonsterIds = (levelData: LevelData) => {
    var monsterIds: string[] = [];
    return (level: Level): Level => {
        if (level.difficulty == Difficulty.Normal) {
            monsterIds = shuffle(levelData.NormalMonsters);
        } else {
            monsterIds = shuffle(levelData.NightmareAndHellMonsters);
        }
        while (monsterIds.length > levelData.NumMon) {
            monsterIds.pop();
        }
        return {
            ...level,
            monsterIds: monsterIds,
        };
    };
};

const calculateTotalMonsterPacks = (levelData: LevelData) => {
    function getTotalMonsterPacks(x: number, y: number, density: number) {
        var totalMonsterPacks = 0;
        for (let i = 0; i < x * y; i++) {
            if (Math.random() < density / 100000) {
                totalMonsterPacks++;
            }
        }

        return totalMonsterPacks;
    }
    return (level: Level): Level => {
        var totalMonsterPacks: number;
        if (level.difficulty == Difficulty.Normal) {
            totalMonsterPacks = getTotalMonsterPacks(
                levelData.SizeX,
                levelData.SizeY,
                levelData.MonDen
            );
        } else if (level.difficulty == Difficulty.Nightmare) {
            totalMonsterPacks = getTotalMonsterPacks(
                levelData["SizeX(N)"],
                levelData["SizeY(N)"],
                levelData["MonDen(N)"]
            );
        } else {
            totalMonsterPacks = getTotalMonsterPacks(
                levelData["SizeX(H)"],
                levelData["SizeY(H)"],
                levelData["MonDen(H)"]
            );
        }
        return {
            ...level,
            totalMonsterPacks: totalMonsterPacks,
        };
    };
};

const calculateMonsterAmounts = (levelData: LevelData) => {
    return (level: Level): Level => {
        var monsterAmounts: {
            monster: Monster;
            amount: number;
            minionAmount: number;
        }[] = [];

        monsterAmounts = level.monsterIds.map((monsterId) => {
            return {
                monster: createMonster(monsterId, level.difficulty),
                amount: 0,
                minionAmount: 0,
            };
        });
        console.log(monsterAmounts);
        // split up total monster packs into amounts based on spawn rarity for each monster
        // if a monster's rarity is picked, then add an amount equal to getRandomInt(groupMin, groupMax)
        // if that monster has any minions which aren't equal to itself, find party size and then add that to minionAmount
        for (let i = 0; i < level.totalMonsterPacks; ) {
            var randomMonsterIndex = Math.floor(
                Math.random() * level.monsterIds.length
            );
            var monster = monsterAmounts[randomMonsterIndex].monster;
            var monsterRarity = monster.rarity as number;
            // rolls to see if number between 1 and monsterRarity is == monsterRarity, and if so then it was chosen (rarity is 1 or 2)
            // adds number between groupmin/max to the total amount for this monster
            if (
                (monsterRarity &&
                    getRandomInt(1, monsterRarity) == monsterRarity) ||
                !monsterRarity
            ) {
                i++;
                monsterAmounts[randomMonsterIndex].amount += getRandomInt(
                    monster.GroupMin as number,
                    monster.GroupMax as number
                );
                // if that monster has any minions which aren't equal to itself, find party size and then add that to minionAmount
                if (
                    monster.minions?.every((minion) => {
                        return monster.name != minion.name;
                    })
                ) {
                    (monsterAmounts[randomMonsterIndex]
                        .minionAmount as number) += getRandomInt(
                        monster.PartyMin as number,
                        monster.PartyMax as number
                    );
                }
            }
        }
        return {
            ...level,
            monsterAmounts: monsterAmounts,
        };
    };
};

const calculateTotalUniquePacks = (levelData: LevelData) => {
    var totalUniquePacks: number;

    function getTotalUniquePacks(min: number, max: number) {
        //returns random number between max and min
        return Math.floor(Math.random() * (max - min) + min + 1);
    }
    return (level: Level): Level => {
        if (level.difficulty == Difficulty.Normal) {
            totalUniquePacks = getTotalUniquePacks(
                levelData.MonUMin,
                levelData.MonUMax
            );
        } else if (level.difficulty == Difficulty.Nightmare) {
            totalUniquePacks = getTotalUniquePacks(
                levelData["MonUMin(N)"],
                levelData["MonUMax(N)"]
            );
        } else {
            totalUniquePacks = getTotalUniquePacks(
                levelData["MonUMin(H)"],
                levelData["MonUMax(H)"]
            );
        }
        return {
            ...level,
            totalUniquePacks: totalUniquePacks,
        };
    };
};

const calculateUniqueIdPackAmounts = (levelData: LevelData) => {
    var monsterIdPackAmounts: {
        monsterId: string;
        amountOfPacks: number;
    }[] = [];

    return (level: Level): Level => {
        level.monsterIds.forEach((monsterId) => {
            monsterIdPackAmounts.push({
                monsterId: monsterId,
                amountOfPacks: 0,
            });
        });
        for (let i = 0; i < level.totalUniquePacks; i++) {
            var randomMonsterIdIndex = Math.floor(
                Math.random() * level.monsterIds.length
            );
            monsterIdPackAmounts[randomMonsterIdIndex].amountOfPacks++;
        }
        return {
            ...level,
            uniqueIdPackAmounts: monsterIdPackAmounts,
        };
    };
};

const calculateZoneMonsterLevel = (levelData: LevelData) => {
    var zoneLevel: number;

    return (level: Level): Level => {
        if (level.difficulty == Difficulty.Normal) {
            zoneLevel = levelData.MonsterLevelsExpansion[Difficulty.Normal];
        } else if (level.difficulty == Difficulty.Nightmare) {
            zoneLevel = levelData.MonsterLevelsExpansion[Difficulty.Nightmare];
        } else {
            zoneLevel = levelData.MonsterLevelsExpansion[Difficulty.Hell];
        }
        return {
            ...level,
            zoneMonsterLevel: zoneLevel,
        };
    };
};

export const createLevelBase = (
    levelData: LevelData,
    difficulty: Difficulty
) => {
    return ramda.pipe(
        setDifficulty(difficulty),
        setLevelName(levelData),
        calculateMonsterIds(levelData),
        calculateTotalMonsterPacks(levelData),
        calculateMonsterAmounts(levelData),
        calculateTotalUniquePacks(levelData),
        calculateUniqueIdPackAmounts(levelData),
        calculateZoneMonsterLevel(levelData)
    );
};

// testZone();

// function testZone() {
//     var zoneName = "Cold Plains";
//     var levelData = getLevelDataFromName(zoneName);
//     var levelBase = createLevelBase(levelData, Difficulty.Hell);
//     var level = {} as Level;
//     level = levelBase(level);
//     console.log(zoneName);
// }
