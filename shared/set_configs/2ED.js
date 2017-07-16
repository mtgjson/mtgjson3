var LEA = require('./LEA');

module.exports.SET = {
    name: "Unlimited Edition",
    code: "2ED",
    gathererCode: "2U",
    magicCardsInfoCode: "un",
    releaseDate: "1993-12-01",
    border: "white",
    type: "core",
    booster: ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common"],
    mkm_name: "Unlimited",
    mkm_id: 3
};

// Copy from LEA
module.exports.SET_CORRECTIONS = LEA.SET_CORRECTIONS.slice();
