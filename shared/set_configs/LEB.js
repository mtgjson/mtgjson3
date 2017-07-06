var LEA = require('./LEA');

module.exports.SET = {
    name: "Limited Edition Beta",
    code: "LEB",
    gathererCode: "2E",
    magicCardsInfoCode: "be",
    releaseDate: "1993-10-01",
    border: "black",
    type: "core",
    booster: ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common"],
    mkm_name: "Beta",
    mkm_id: 2
};

// Copy from LEA
module.exports.SET_CORRECTIONS = LEA.SET_CORRECTIONS.concat([
    { match : {name : "Ley Druid"}, replace : {flavor : "After years of training, the Druid becomes one with nature, drawing power from the land and returning it when needed."}}
]);
