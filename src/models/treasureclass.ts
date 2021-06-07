import { getRandomInt } from "utils";
import { Monster } from "models";
import { option as O, either as E, record as R } from "fp-ts";

import * as FP from "fp-ts/function";
import * as FPArray from "fp-ts/array";
import { readonlyMap } from "fp-ts/lib/ReadonlyMap";
import * as ramda from "ramda";

const treasureClassData = require("d2data/TreasureClassExNew.json") as Record<
    string,
    TreasureClass
>;

const atomicData = require("d2data/atomic.json") as Record<
    string,
    Record<string, number>
>;

export interface TreasureClass {
    itemDropTableProbabilities: ItemDropTableProbability[];
    group: number;
    level: number;
    Picks: number;
    SumItems: number;
    TotalProb: number;
    DropChance?: number;
    NoDrop?: number;
    "Treasure Class": string;
}

export interface ItemDropTableProbability {
    itemId: string;
    probability: number;
}

export const getTreasureClassFromId = (id: string): O.Option<TreasureClass> => {
    return O.fromNullable(treasureClassData[id]);
};

// export const getItemIdsFromTreasureClassId = (id: string) => {

//     FP.flow(getTreasureClassFromId)
//     let treasureClass = ;

//     let itemIds = getItemIdsFromTreasureClass(treasureClass);

//     let atomicCodes = getAtomicCodes(itemIds);

//     return atomicCodes;
// };

// O.Option<O.Option<string>[]> -> O.Option<O.Option<string[]>> -> O.Option<string[]>
const getItemIdsFromTreasureClass = FP.flow(
    O.chain((treasureClass: TreasureClass) =>
        FPArray.sequence(O.option)(
            FPArray.range(0, Math.abs(treasureClass.Picks))
                .map(() => getItemIdFromTreasureClass(treasureClass))
                .filter(O.isSome)
        )
    )
);

// const getItemIdFromTreasureClass = (treasureClass: TreasureClass): string => {
//     let itemId: string = "";
//     let dissipator = calculateDissipator(treasureClass);

// treasureClass.itemDropTableProbabilities.forEach(
//     (itemDropTableProbability) => {
//         dissipator -= itemDropTableProbability.probability;

//         if (dissipator <= 0 && !itemId) {
//             if (itemDropTableProbability.itemId.includes("gld")) {
//                 itemId = itemDropTableProbability.itemId;
//             } else {
//                 // if the treasure class rolled isn't an itemId, set it as potentialTreasureClass then recurse
//                 let potentialTreasureClass = getTreasureClassFromId(
//                     itemDropTableProbability.itemId
//                 );

//                 if (potentialTreasureClass) {
//                     itemId = getItemIdFromTreasureClass(
//                         potentialTreasureClass
//                     );
//                 } else {
//                     itemId = itemDropTableProbability.itemId;
//                 }
//             }
//         }
//     }
// );

//     return itemId;
// };

const getItemIdFromTreasureClass = (treasureClass: TreasureClass) =>
    FP.pipe(
        calculateDissipator(treasureClass),
        O.chain((dissipator) =>
            FP.pipe(
                O.fromNullable(
                    treasureClass.itemDropTableProbabilities.find(
                        (itemDropTableProbability) => {
                            dissipator -= itemDropTableProbability.probability;
                            return dissipator <= 0;
                        }
                    )
                ),
                O.chain(
                    (
                        itemDropTableProbability: ItemDropTableProbability
                    ): O.Option<string> => {
                        return FP.pipe(
                            getTreasureClassFromId(
                                itemDropTableProbability.itemId
                            ),
                            O.map(getItemIdFromTreasureClass),
                            O.fold(
                                // in the case of "gld" or a non-treasure class ID we want to return itemId
                                () => O.some(itemDropTableProbability.itemId),
                                FP.identity
                            )
                        );
                    }
                )
            )
        )
    );

const getAtomicCodes = FP.flow(
    // chain = flatMap
    O.chain((itemIds: string[]) =>
        // sequence turns Option<string>[] -> Option<string[]>
        FPArray.sequence(O.option)(
            itemIds.map((atomicId) =>
                FP.pipe(
                    R.lookup(atomicId, atomicData),
                    O.chain((atomic: Record<string, number>) =>
                        FP.pipe(
                            getTotalAtomicProbability(atomic),
                            (totalProb) => getRandomInt(1, totalProb),
                            (dissipator) =>
                                O.fromNullable(
                                    Object.entries(atomic).find(
                                        ([, probability]) => {
                                            dissipator -= probability;

                                            return dissipator <= 0;
                                        }
                                    )?.[0]
                                )
                        )
                    )
                )
            )
        )
    )
);

const getTotalAtomicProbability = R.reduce(0, (accum, current: number) => {
    return accum + current;
});

// export const getItemIdsFromNormalMonster = (monster: Monster): string[] => {
//     return getItemIdsFromTreasureClassId(
//         monster.treasureClasses[0]["Treasure Class"]
//     );
// };

export const calculateDissipator = (
    treasureClass: TreasureClass
): O.Option<number> => {
    if (treasureClass.NoDrop) {
        let dissipator = getRandomInt(
            1,
            treasureClass.TotalProb + treasureClass.NoDrop
        );

        if (dissipator < treasureClass.NoDrop) {
            return O.none;
        } else {
            return O.some(dissipator - treasureClass.NoDrop);
        }
    } else {
        return O.some(getRandomInt(1, treasureClass.TotalProb));
    }
};

export const getItemIdsFromTreasureClassId = FP.flow(
    getTreasureClassFromId,
    getItemIdsFromTreasureClass,
    getAtomicCodes
);
