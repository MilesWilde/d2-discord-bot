import {
    Item,
    ItemRarity,
    GearSlot,
    Affix,
    Shield,
    ArmorData,
    Armor,
    ItemAffixCode,
    AffixType,
    ItemDataType,
    createHelmBase,
    CreateHelmImageDescription,
    calculateRequiredLevel,
    WeaponData,
    MiscData,
    getArmorDataFromId,
    getWeaponDataFromId,
    getMiscDataFromId,
} from "models/item_models";
import {
    getItemIdsFromTreasureClassId,
    getItemIdsFromNormalMonster,
    Level,
    getLevelDataFromName,
    createLevelBase,
    Difficulty,
    getTreasureClassFromId,
    setDissipator,
} from "models";
import { createImage } from "utils";
import * as Option from "fp-ts/Option";
import * as FP from "fp-ts/function";

let fs = require("fs");
import path from "path";

let armorRecord = require("d2data/armor.json") as Record<string, ArmorData>;
let weaponsRecord = require("d2data/weapons.json") as Record<
    string,
    WeaponData
>;
let miscRecord = require("d2data/misc.json") as Record<string, MiscData>;
let itemIdFileMap = require("d2data/itemIdFileMap.json") as Record<
    string,
    string
>;

export const getItemDataFromItemId = (itemId: string): {} => {
    if (itemId.includes("gld")) {
        return { name: itemId };
    } else if (itemIdFileMap[itemId] == "armor.json") {
        return getArmorDataFromId(itemId);
    } else if (itemIdFileMap[itemId] == "weapons.json") {
        return getWeaponDataFromId(itemId);
    } else {
        return getMiscDataFromId(itemId);
    }
};

// export const createItemFromData = (dataItems: {}[]): any[] => {
//     return

// };

test();

export const KillMonsters = () => {
    var zoneName = "Cold Plains";
    var levelData = getLevelDataFromName(zoneName);
    var levelBase = createLevelBase(levelData, Difficulty.Hell);
    var level = {} as Level;
    level = levelBase(level);
    let allLevelDropIds: string[][] = [];
    let killString = ``;
    level.monsterAmounts.forEach((monsterAmount) => {
        killString += `You killed ${monsterAmount.amount} ${monsterAmount.monster.name}\n`;

        for (let i = 0; i < monsterAmount.amount; i++) {
            allLevelDropIds.push(
                getItemIdsFromNormalMonster(monsterAmount.monster)
            );
        }
        if (monsterAmount.minionAmount) {
            monsterAmount.monster.minions?.forEach((minion) => {
                killString += `You killed ${monsterAmount.minionAmount} ${minion.name}\n`;

                for (let j = 0; j < monsterAmount.minionAmount; j++) {
                    allLevelDropIds.push(getItemIdsFromNormalMonster(minion));
                }
            });
        }
    });

    // [[id], [id,id], [id], [id,id,id]] -> [data, data, data, data, data, data, data]
    let allLevelDropData: any[] = [];
    allLevelDropIds.forEach((itemIds) => {
        itemIds.forEach((itemId) => {
            allLevelDropData.push(getItemDataFromItemId(itemId));
        });
    });

    let dataNames: any[] = [];
    allLevelDropData.forEach((dropData) => {
        dataNames.push(dropData["name"]);
    });
    fs.writeFile(
        path.resolve(`./${zoneName} Kills.txt`),
        killString,
        (err: any) => {
            if (err) {
                console.log("Error writing file", err);
            } else {
                console.log("Successfully wrote file");
            }
        }
    );
    fs.writeFile(
        path.resolve(`./${zoneName} Drops.txt`),
        JSON.stringify(dataNames, null, 4),
        (err: any) => {
            if (err) {
                console.log("Error writing file", err);
            } else {
                console.log("Successfully wrote file");
            }
        }
    );
};

function test() {
    const dissipatorValue = fold(
        () => 0,
        (dissipator: number) => dissipator
    );

    let dissipator = dissipatorValue(
        setDissipator(getTreasureClassFromId("Act 1 Chest A"))
    );
    FP.flow(setDissipator(getTreasureClassFromId("Act 1 Chest A")));

    console.log(dissipator);

    // let shieldOutputPath = "./testshield.png";
    // let helmOutputPath = "./testhelm.png";
    // let bodyArmorOutputPath = "./testbodyarmor.png";

    // let armorDataShield = getRandomArmorData(armorRecord, ItemAffixCode.Shield);
    // let testShield = new Shield(
    //     50,
    //     armorDataShield.levelreq as number,
    //     ItemRarity.Magic,
    //     armorDataShield.gemsockets as number,
    //     "what",
    //     armorDataShield.name as string,
    //     getRandomInt(
    //         armorDataShield.minac as number,
    //         armorDataShield.maxac as number
    //     ),
    //     armorDataShield.reqstr as number,
    //     armorDataShield.block as number
    // );

    // testShield = randomizeMagicItem(testShield);
    // let shieldImageDescriptionList = testShield.CreateImageDescription();
    // let shieldImageFilePath = `./d2data/item_images/${armorDataShield.invfile}.png`;
    // createImage(shieldImageDescriptionList, shieldImageFilePath, shieldOutputPath);

    // let armorDataHelm = getRandomArmorData(armorRecord, [
    //     ItemDataType.Helm,
    //     ItemDataType.Circlet,
    // ]);
    // let testHelmBase = createHelmBase(armorDataHelm);
    // let testHelm = testHelmBase({} as Armor);

    // testHelm = randomizeMagicItem(testHelm);
    // testHelm = calculateRequiredLevel(testHelm);
    // let helmImageDescriptionList = CreateHelmImageDescription(testHelm);
    // let helmImageFilePath = `./d2data/item_images/${armorDataHelm.invfile}.png`;
    // createImage(helmImageDescriptionList, helmImageFilePath, helmOutputPath);

    // let armorDataBodyArmor = getRandomArmorData(
    //     armorRecord,
    //     ItemDataType.BodyArmor
    // );

    // let testBodyArmor = new BodyArmor(
    //     50,
    //     armorDataBodyArmor.levelreq as number,
    //     ItemRarity.Magic,
    //     armorDataBodyArmor.gemsockets as number,
    //     "what",
    //     armorDataBodyArmor.name as string,
    //     getRandomInt(
    //         armorDataBodyArmor.minac as number,
    //         armorDataBodyArmor.maxac as number
    //     ),
    //     armorDataBodyArmor.reqstr as number
    // );

    // let whatever = { ...armorDataBodyArmor };

    // testBodyArmor = randomizeMagicItem(testBodyArmor);
    // let bodyArmorImageDescriptionList = testBodyArmor.CreateImageDescription();
    // let bodyArmorImageFilePath = `./d2data/item_images/${armorDataBodyArmor.invfile}.png`;

    // createImage(
    //     bodyArmorImageDescriptionList,
    //     bodyArmorImageFilePath,
    //     bodyArmorOutputPath
    // );
}
