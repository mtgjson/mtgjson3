module.exports.SET = {
    name: "Limited Edition Alpha",
    code: "LEA",
    gathererCode: "1E",
    magicCardsInfoCode: "al",
    releaseDate: "1993-08-05",
    border: "black",
    type: "core",
    booster: ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common"],
    mkm_name: "Alpha",
    mkm_id: 1
};

module.exports.SET_CORRECTIONS = [
    "noBasicLandWatermarks",
    { match : {name : ["Elvish Archers", "Goblin Balloon Brigade", "Wall of Air"]}, flavorAddExclamation : true},
    { match : {name : ["Jade Statue", "Scathe Zombies"]}, flavorAddDash : true},
    { match : {name : "Mahamoti Djinn"}, replace : {flavor : "Of royal blood among the spirits of the air, the Mahamoti Djinn rides on the wings of the winds. As dangerous in the gambling hall as he is in battle, he is a master of trickery and misdirection."}},
    { match : {name : "Pearled Unicorn"}, replace : {flavor : "\"‘Do you know, I always thought Unicorns were fabulous monsters, too? I never saw one alive before!' ‘Well, now that we have seen each other,' said the Unicorn, ‘if you'll believe in me, I'll believe in you.'\" —Lewis Carroll"}},
    { match : {name : "Roc of Kher Ridges"}, replace : {flavor : "We encountered a valley topped with immense boulders and eerie rock formations. Suddenly one of these boulders toppled from its perch and sprouted gargantuan wings, casting a shadow of darkness and sending us fleeing in terror."}},
    { match : {name : "Wall of Ice"}, replace : {flavor : "\"And through the drifts the snowy cliffs/ Did send a dismal sheen:/ Nor shapes of men nor beasts we ken—/ The ice was all between.\"/—Samuel Coleridge, \"The Rime of the Ancient Mariner\""}},
    { match : {name : "Air Elemental"}, replace : {flavor : "These spirits of the air are winsome and wild, and cannot be truly contained. Only marginally intelligent, they often substitute whimsy for strategy, delighting in mischief and mayhem."}},
    { match : {name : "Uthden Troll"}, replace : {flavor : "\"Oi oi oi, me gotta hurt in 'ere,\nOi oi oi, me smell a ting is near,\nGonna bosh 'n gonna nosh 'n da\nhurt'll disappear.\"\n—Traditional"}},
    { match : {name : "Scathe Zombies"}, replace : {flavor : "\"They groaned, they stirred, they all uprose,/ Nor spake, nor moved their eyes;/ It had been strange, even in a dream,/ To have seen those dead men rise.\"/ —Samuel Coleridge, \"The Rime of the Ancient Mariner\""}},
    { match : {name : "Granite Gargoyle"}, replace : {flavor : "\"While most overworlders fortunately don't realize this, Gargoyles can be most delicious, providing you have the appropriate tools to carve them.\"\n—The Underworld Cookbook, by Asmoranomardicadaistinaculdacar"}},
    { match : {name : "Obsianus Golem"}, replace : {flavor : "\"The foot stone is connected to the ankle stone, the ankle stone is connected to the leg stone...\"\n—Song of the Artificer"}},
    { match : {name : "Wall of Brambles"}, replace : {flavor : "\"What else, when chaos draws all forces inward to shape a single leaf.\"\n —Conrad Aiken"}},
    // Using multiverseid here because these rules get copied into LEB and 2ED
    { match : {multiverseid: 243}, replace : {artist : "Mark Tedin"} },
    { match : {multiverseid: 248}, replace : {artist : "Mark Poole"} },
    { match : {multiverseid: 220}, replace : {artist : "Dan Frazier"} },
    { match : {multiverseid: 285}, replace : {artist : "Jesper Myrfors"} }
];
