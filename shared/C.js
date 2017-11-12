"use strict";

(function(exports) {
  exports.SUPERTYPES = ["Basic", "Legendary", "Snow", "World", "Ongoing"];
  exports.TYPES = ["Instant", "Sorcery", "Artifact", "Creature", "Enchantment", "Land", "Planeswalker", "Tribal", "Plane", "Phenomenon", "Scheme", "Vanguard", "Conspiracy"];

  // Unglued/Unhinged types
  exports.TYPES.push("Enchant", "Player", "Interrupt", "Scariest", "You'll", "Ever", "See", "Eaturecray");

  exports.LAST_PRINTINGS_RESET = "C15";

  exports.SETS_LACKING_HQ_SVG_SYMBOL_ICONS = ["DDO"];

  exports.SETS_NOT_ON_GATHERER = ["ATH", "ITP", "DKM", "RQS", "DPA"];
  exports.SETS_WITH_NO_IMAGES = [];

  exports.IGNORE_GATHERER_PRINTINGS = ["Promo set for Gatherer"];

  exports.NON_GATHERER_SET_CARD_LISTS =
  {
    ATH : ["Aesthir Glider", "Armageddon", "Armored Pegasus", "Benalish Knight", "Black Knight", "Brushland", "Canopy Spider", "Carnivorous Plant", "Combat Medic", "Cuombajj Witches", "Disenchant", "Drifting Meadow", "Erhnam Djinn", "Feast of the Unicorn", "Fireball", "Forest", "Freewind Falcon", "Giant Growth", "Giant Spider", "Goblin Balloon Brigade", "Goblin Digging Team", "Goblin Grenade", "Goblin Hero", "Goblin King", "Goblin Matron", "Goblin Mutant", "Goblin Offensive", "Goblin Recruiter", "Goblin Snowman", "Goblin Tinkerer", "Goblin Vandal", "Goblin Warrens", "Gorilla Chieftain", "Hurricane", "Hymn to Tourach", "Hypnotic Specter", "Icatian Javelineers", "Ihsan's Shade", "Infantry Veteran", "Jalum Tome", "Knight of Stromgald", "Lady Orca", "Lightning Bolt", "Llanowar Elves", "Mirri, Cat Warrior", "Mogg Fanatic", "Mogg Flunkies", "Mogg Raider", "Mountain", "Nevinyrral's Disk", "Order of the White Shield", "Overrun", "Pacifism", "Pegasus Charger", "Pegasus Stampede", "Pendelhaven", "Plains", "Polluted Mire", "Pyrokinesis", "Pyrotechnics", "Raging Goblin", "Ranger en-Vec", "Sacred Mesa", "Samite Healer", "Scavenger Folk", "Serra Angel", "Serrated Arrows", "Slippery Karst", "Smoldering Crater", "Spectral Bears", "Strip Mine", "Swamp", "Swords to Plowshares", "Terror", "Unholy Strength", "Uthden Troll", "Volcanic Dragon", "Warrior's Honor", "White Knight", "Woolly Spider", "Youthful Knight"],
    ITP : ["Alabaster Potion", "Battering Ram", "Bog Imp", "Bog Wraith", "Circle of Protection: Black", "Circle of Protection: Red", "Clockwork Beast", "Cursed Land", "Dark Ritual", "Detonate", "Disintegrate", "Durkwood Boars", "Elven Riders", "Elvish Archers", "Energy Flux", "Feedback", "Fireball", "Forest", "Glasses of Urza", "Grizzly Bears", "Healing Salve", "Hill Giant", "Ironclaw Orcs", "Island", "Jayemdae Tome", "Lost Soul", "Merfolk of the Pearl Trident", "Mesa Pegasus", "Mons's Goblin Raiders", "Mountain", "Murk Dwellers", "Orcish Artillery", "Orcish Oriflamme", "Pearled Unicorn", "Phantom Monster", "Plains", "Power Sink", "Pyrotechnics", "Raise Dead", "Reverse Damage", "Rod of Ruin", "Scathe Zombies", "Sorceress Queen", "Swamp", "Terror", "Twiddle", "Unsummon", "Untamed Wilds", "Vampire Bats", "Wall of Bone", "War Mammoth", "Warp Artifact", "Weakness", "Whirling Dervish", "Winter Blast", "Zephyr Falcon", "Scryb Sprites"],
    DKM : ["Abyssal Specter", "Balduvian Bears", "Balduvian Horde", "Barbed Sextant", "Bounty of the Hunt", "Contagion", "Dark Banishing", "Dark Ritual", "Death Spark", "Elkin Bottle", "Elvish Bard", "Folk of the Pines", "Forest", "Forest", "Forest", "Foul Familiar", "Fyndhorn Elves", "Giant Growth", "Giant Trap Door Spider", "Goblin Mutant", "Guerrilla Tactics", "Hurricane", "Icy Manipulator", "Incinerate", "Jokulhaups", "Karplusan Forest", "Lava Burst", "Lhurgoyf", "Mountain", "Mountain", "Mountain", "Necropotence", "Orcish Cannoneers", "Phantasmal Fiend", "Phyrexian War Beast", "Pillage", "Pyroclasm", "Shatter", "Soul Burn", "Storm Shaman", "Sulfurous Springs", "Swamp", "Swamp", "Swamp", "Underground River", "Walking Wall", "Woolly Spider", "Yavimaya Ancients", "Yavimaya Ants", "Lim-Dûl's High Guard"],
    RQS : ["Alabaster Potion", "Battering Ram", "Bog Imp", "Bog Wraith", "Circle of Protection: Black", "Circle of Protection: Red", "Clockwork Beast", "Cursed Land", "Dark Ritual", "Detonate", "Disintegrate", "Durkwood Boars", "Elven Riders", "Elvish Archers", "Energy Flux", "Feedback", "Fireball", "Forest", "Glasses of Urza", "Grizzly Bears", "Healing Salve", "Hill Giant", "Ironclaw Orcs", "Island", "Jayemdae Tome", "Lost Soul", "Merfolk of the Pearl Trident", "Mesa Pegasus", "Mons's Goblin Raiders", "Mountain", "Murk Dwellers", "Orcish Artillery", "Orcish Oriflamme", "Pearled Unicorn", "Plains", "Power Sink", "Pyrotechnics", "Raise Dead", "Reverse Damge", "Rod of Ruin", "Scath Zombies", "Scryb Sprites", "Sorceress Queen", "Swamp", "Terror", "Twiddle", "Unsummon", "Untamed Wilds", "Vampire Bats", "Wall of Bone", "War Mammoth", "Warp Artifact", "Weakness", "Whirling Dervish", "Winter Blast", "Zephyr Falcon"],
    DPA : ["Abyssal Specter", "Act of Treason", "Air Elemental", "Ascendant Evincar", "Banefire", "Blanchwood Armor", "Blaze", "Bloodmark Mentor", "Boomerang", "Cancel", "Cinder Pyromancer", "Civic Wayfinder", "Cloud Sprite", "Coat of Arms", "Consume Spirit", "Counterbore", "Crowd of Cinders", "Deluge", "Demon's Horn", "Denizen of the Deep", "Dragon's Claw", "Drove of Elves", "Drudge Skeletons", "Dusk Imp", "Duskdale Wurm", "Earth Elemental", "Elven Riders", "Elvish Champion", "Elvish Eulogist", "Elvish Promenade", "Elvish Visionary", "Elvish Warrior", "Enrage", "Essence Drain", "Essence Scatter", "Evacuation", "Eyeblight's Ending", "Forest", "Forest", "Forest", "Forest", "Furnace of Rath", "Gaea's Herald", "Giant Growth", "Giant Spider", "Goblin Piker", "Goblin Sky Raider", "Greenweaver Druid", "Hill Giant", "Howl of the Night Pack", "Immaculate Magistrate", "Imperious Perfect", "Incinerate", "Island", "Island", "Island", "Island", "Jagged-Scar Archers", "Kamahl, Pit Fighter", "Kraken's Eye", "Lightning Elemental", "Loxodon Warhammer", "Lys Alana Huntmaster", "Mahamoti Djinn", "Megrim", "Mind Control", "Mind Rot", "Mind Shatter", "Mind Spring", "Molimo, Maro-Sorcerer", "Moonglove Winnower", "Mortivore", "Mountain", "Mountain", "Mountain", "Mountain", "Natural Spring", "Naturalize", "Nature's Spiral", "Negate", "Overrun", "Phantom Warrior", "Prodigal Pyromancer", "Rage Reflection", "Rampant Growth", "Ravenous Rats", "River Boa", "Roughshod Mentor", "Runeclaw Bear", "Sengir Vampire", "Severed Legion", "Shivan Dragon", "Shock", "Snapping Drake", "Spined Wurm", "Swamp", "Swamp", "Swamp", "Swamp", "Talara's Battalion", "Terror", "The Rack", "Thieving Magpie", "Trained Armodon", "Troll Ascetic", "Underworld Dreams", "Unholy Strength", "Unsummon", "Verdant Force", "Vigor", "Wall of Spears", "Wall of Wood", "Wurm's Tooth"]
  };

  exports.NON_GATHERER_SET_RARITY_MAP =
  {
    DKM : { "Abyssal Specter" : "Uncommon", "Balduvian Bears" : "Common", "Balduvian Horde" : "Rare", "Barbed Sextant" : "Common", "Bounty of the Hunt" : "Uncommon", "Contagion" : "Uncommon", "Dark Banishing" : "Common", "Dark Ritual" : "Common", "Death Spark" : "Uncommon", "Elkin Bottle" : "Rare", "Elvish Bard" : "Uncommon", "Folk of the Pines" : "Common", "Forest" : "Basic Land", "Foul Familiar" : "Common", "Fyndhorn Elves" : "Common", "Giant Growth" : "Common", "Giant Trap Door Spider" : "", "Goblin Mutant" : "Uncommon", "Guerrilla Tactics" : "Common", "Hurricane" : "Uncommon", "Icy Manipulator" : "Uncommon", "Incinerate" : "Common", "Jokulhaups" : "Rare", "Karplusan Forest" : "Rare", "Lava Burst" : "Common", "Lhurgoyf" : "Rare", "Lim-Dûl's High Guard" : "Common", "Mountain" : "Basic Land", "Necropotence" : "Rare", "Orcish Cannoneers" : "Uncommon", "Phantasmal Fiend" : "Common", "Phyrexian War Beast" : "Common", "Pillage" : "Uncommon", "Pyroclasm" : "Uncommon", "Shatter" : "Common", "Soul Burn" : "Common", "Storm Shaman" : "Common", "Sulfurous Springs" : "Rare", "Swamp" : "Basic Land", "Underground River" : "Rare", "Walking Wall" : "Uncommon", "Woolly Spider" : "Common", "Yavimaya Ancients" : "Common", "Yavimaya Ants" : "Uncommon" },
    DPA : { "Air Elemental" : "Uncommon", "Boomerang" : "Common", "Cancel" : "Common", "Cloud Sprite" : "Common", "Counterbore" : "Rare", "Deluge" : "Uncommon", "Denizen of the Deep" : "Rare", "Essence Scatter" : "Common", "Evacuation" : "Rare", "Mahamoti Djinn" : "Rare", "Mind Control" : "Uncommon", "Mind Spring" : "Rare", "Negate" : "Common", "Phantom Warrior" : "Uncommon", "Snapping Drake" : "Common", "Thieving Magpie" : "Uncommon", "Unsummon" : "Common", "Abyssal Specter" : "Uncommon", "Ascendant Evincar" : "Rare", "Consume Spirit" : "Uncommon", "Crowd of Cinders" : "Uncommon", "Drudge Skeletons" : "Common", "Dusk Imp" : "Common", "Essence Drain" : "Common", "Eyeblight's Ending" : "Common", "Megrim" : "Uncommon", "Mind Rot" : "Common", "Mind Shatter" : "Rare", "Moonglove Winnower" : "Common", "Mortivore" : "Rare", "Ravenous Rats" : "Common", "Sengir Vampire" : "Rare", "Severed Legion" : "Common", "Terror" : "Common", "Underworld Dreams" : "Rare", "Unholy Strength" : "Common", "Act of Treason" : "Uncommon", "Banefire" : "Rare", "Blaze" : "Uncommon", "Bloodmark Mentor" : "Uncommon", "Cinder Pyromancer" : "Common", "Earth Elemental" : "Uncommon", "Enrage" : "Uncommon", "Furnace of Rath" : "Rare", "Goblin Piker" : "Common", "Goblin Sky Raider" : "Common", "Hill Giant" : "Common", "Incinerate" : "Common", "Kamahl, Pit Fighter" : "Rare", "Lightning Elemental" : "Common", "Prodigal Pyromancer" : "Uncommon", "Rage Reflection" : "Rare", "Shivan Dragon" : "Rare", "Shock" : "Common", "Blanchwood Armor" : "Uncommon", "Civic Wayfinder" : "Common", "Drove of Elves" : "Uncommon", "Duskdale Wurm" : "Uncommon", "Elven Riders" : "Uncommon", "Elvish Champion" : "Rare", "Elvish Eulogist" : "Common", "Elvish Promenade" : "Uncommon", "Elvish Visionary" : "Common", "Elvish Warrior" : "Common", "Gaea's Herald" : "Rare", "Giant Growth" : "Common", "Giant Spider" : "Common", "Greenweaver Druid" : "Uncommon", "Howl of the Night Pack" : "Uncommon", "Immaculate Magistrate" : "Rare", "Imperious Perfect" : "Uncommon", "Jagged-Scar Archers" : "Uncommon", "Lys Alana Huntmaster" : "Common", "Molimo, Maro-Sorcerer" : "Rare", "Natural Spring" : "Common", "Naturalize" : "Common", "Nature's Spiral" : "Uncommon", "Overrun" : "Uncommon", "Rampant Growth" : "Common", "River Boa" : "Uncommon", "Roughshod Mentor" : "Uncommon", "Runeclaw Bear" : "Common", "Spined Wurm" : "Common", "Talara's Battalion" : "Rare", "Trained Armodon" : "Common", "Troll Ascetic" : "Rare", "Verdant Force" : "Rare", "Vigor" : "Rare", "Wall of Wood" : "Common", "Coat of Arms" : "Rare", "Demon's Horn" : "Uncommon", "Dragon's Claw" : "Uncommon", "Kraken's Eye" : "Uncommon", "Loxodon Warhammer" : "Rare", "The Rack" : "Uncommon", "Wall of Spears" : "Common", "Wurm's Tooth" : "Uncommon" }
  };

    exports.IGNORE_GATHERER_PRINTINGS = ["Promo set for Gatherer"];

    exports.NON_GATHERER_SET_CARD_LISTS =
    {
        ATH : ["Aesthir Glider", "Armageddon", "Armored Pegasus", "Benalish Knight", "Black Knight", "Brushland", "Canopy Spider", "Carnivorous Plant", "Combat Medic", "Cuombajj Witches", "Disenchant", "Drifting Meadow", "Erhnam Djinn", "Feast of the Unicorn", "Fireball", "Forest", "Freewind Falcon", "Giant Growth", "Giant Spider", "Goblin Balloon Brigade", "Goblin Digging Team", "Goblin Grenade", "Goblin Hero", "Goblin King", "Goblin Matron", "Goblin Mutant", "Goblin Offensive", "Goblin Recruiter", "Goblin Snowman", "Goblin Tinkerer", "Goblin Vandal", "Goblin Warrens", "Gorilla Chieftain", "Hurricane", "Hymn to Tourach", "Hypnotic Specter", "Icatian Javelineers", "Ihsan's Shade", "Infantry Veteran", "Jalum Tome", "Knight of Stromgald", "Lady Orca", "Lightning Bolt", "Llanowar Elves", "Mirri, Cat Warrior", "Mogg Fanatic", "Mogg Flunkies", "Mogg Raider", "Mountain", "Nevinyrral's Disk", "Order of the White Shield", "Overrun", "Pacifism", "Pegasus Charger", "Pegasus Stampede", "Pendelhaven", "Plains", "Polluted Mire", "Pyrokinesis", "Pyrotechnics", "Raging Goblin", "Ranger en-Vec", "Sacred Mesa", "Samite Healer", "Scavenger Folk", "Serra Angel", "Serrated Arrows", "Slippery Karst", "Smoldering Crater", "Spectral Bears", "Strip Mine", "Swamp", "Swords to Plowshares", "Terror", "Unholy Strength", "Uthden Troll", "Volcanic Dragon", "Warrior's Honor", "White Knight", "Woolly Spider", "Youthful Knight"],
        ITP : ["Alabaster Potion", "Battering Ram", "Bog Imp", "Bog Wraith", "Circle of Protection: Black", "Circle of Protection: Red", "Clockwork Beast", "Cursed Land", "Dark Ritual", "Detonate", "Disintegrate", "Durkwood Boars", "Elven Riders", "Elvish Archers", "Energy Flux", "Feedback", "Fireball", "Forest", "Glasses of Urza", "Grizzly Bears", "Healing Salve", "Hill Giant", "Ironclaw Orcs", "Island", "Jayemdae Tome", "Lost Soul", "Merfolk of the Pearl Trident", "Mesa Pegasus", "Mons's Goblin Raiders", "Mountain", "Murk Dwellers", "Orcish Artillery", "Orcish Oriflamme", "Pearled Unicorn", "Phantom Monster", "Plains", "Power Sink", "Pyrotechnics", "Raise Dead", "Reverse Damage", "Rod of Ruin", "Scathe Zombies", "Sorceress Queen", "Swamp", "Terror", "Twiddle", "Unsummon", "Untamed Wilds", "Vampire Bats", "Wall of Bone", "War Mammoth", "Warp Artifact", "Weakness", "Whirling Dervish", "Winter Blast", "Zephyr Falcon", "Scryb Sprites"],
        DKM : ["Abyssal Specter", "Balduvian Bears", "Balduvian Horde", "Barbed Sextant", "Bounty of the Hunt", "Contagion", "Dark Banishing", "Dark Ritual", "Death Spark", "Elkin Bottle", "Elvish Bard", "Folk of the Pines", "Forest", "Forest", "Forest", "Foul Familiar", "Fyndhorn Elves", "Giant Growth", "Giant Trap Door Spider", "Goblin Mutant", "Guerrilla Tactics", "Hurricane", "Icy Manipulator", "Incinerate", "Jokulhaups", "Karplusan Forest", "Lava Burst", "Lhurgoyf", "Mountain", "Mountain", "Mountain", "Necropotence", "Orcish Cannoneers", "Phantasmal Fiend", "Phyrexian War Beast", "Pillage", "Pyroclasm", "Shatter", "Soul Burn", "Storm Shaman", "Sulfurous Springs", "Swamp", "Swamp", "Swamp", "Underground River", "Walking Wall", "Woolly Spider", "Yavimaya Ancients", "Yavimaya Ants", "Lim-Dûl's High Guard"],
        RQS : ["Alabaster Potion", "Battering Ram", "Bog Imp", "Bog Wraith", "Circle of Protection: Black", "Circle of Protection: Red", "Clockwork Beast", "Cursed Land", "Dark Ritual", "Detonate", "Disintegrate", "Durkwood Boars", "Elven Riders", "Elvish Archers", "Energy Flux", "Feedback", "Fireball", "Forest", "Glasses of Urza", "Grizzly Bears", "Healing Salve", "Hill Giant", "Ironclaw Orcs", "Island", "Jayemdae Tome", "Lost Soul", "Merfolk of the Pearl Trident", "Mesa Pegasus", "Mons's Goblin Raiders", "Mountain", "Murk Dwellers", "Orcish Artillery", "Orcish Oriflamme", "Pearled Unicorn", "Plains", "Power Sink", "Pyrotechnics", "Raise Dead", "Reverse Damge", "Rod of Ruin", "Scath Zombies", "Scryb Sprites", "Sorceress Queen", "Swamp", "Terror", "Twiddle", "Unsummon", "Untamed Wilds", "Vampire Bats", "Wall of Bone", "War Mammoth", "Warp Artifact", "Weakness", "Whirling Dervish", "Winter Blast", "Zephyr Falcon"],
        DPA : ["Abyssal Specter", "Act of Treason", "Air Elemental", "Ascendant Evincar", "Banefire", "Blanchwood Armor", "Blaze", "Bloodmark Mentor", "Boomerang", "Cancel", "Cinder Pyromancer", "Civic Wayfinder", "Cloud Sprite", "Coat of Arms", "Consume Spirit", "Counterbore", "Crowd of Cinders", "Deluge", "Demon's Horn", "Denizen of the Deep", "Dragon's Claw", "Drove of Elves", "Drudge Skeletons", "Dusk Imp", "Duskdale Wurm", "Earth Elemental", "Elven Riders", "Elvish Champion", "Elvish Eulogist", "Elvish Promenade", "Elvish Visionary", "Elvish Warrior", "Enrage", "Essence Drain", "Essence Scatter", "Evacuation", "Eyeblight's Ending", "Forest", "Forest", "Forest", "Forest", "Furnace of Rath", "Gaea's Herald", "Giant Growth", "Giant Spider", "Goblin Piker", "Goblin Sky Raider", "Greenweaver Druid", "Hill Giant", "Howl of the Night Pack", "Immaculate Magistrate", "Imperious Perfect", "Incinerate", "Island", "Island", "Island", "Island", "Jagged-Scar Archers", "Kamahl, Pit Fighter", "Kraken's Eye", "Lightning Elemental", "Loxodon Warhammer", "Lys Alana Huntmaster", "Mahamoti Djinn", "Megrim", "Mind Control", "Mind Rot", "Mind Shatter", "Mind Spring", "Molimo, Maro-Sorcerer", "Moonglove Winnower", "Mortivore", "Mountain", "Mountain", "Mountain", "Mountain", "Natural Spring", "Naturalize", "Nature's Spiral", "Negate", "Overrun", "Phantom Warrior", "Prodigal Pyromancer", "Rage Reflection", "Rampant Growth", "Ravenous Rats", "River Boa", "Roughshod Mentor", "Runeclaw Bear", "Sengir Vampire", "Severed Legion", "Shivan Dragon", "Shock", "Snapping Drake", "Spined Wurm", "Swamp", "Swamp", "Swamp", "Swamp", "Talara's Battalion", "Terror", "The Rack", "Thieving Magpie", "Trained Armodon", "Troll Ascetic", "Underworld Dreams", "Unholy Strength", "Unsummon", "Verdant Force", "Vigor", "Wall of Spears", "Wall of Wood", "Wurm's Tooth"]
    };

    exports.NON_GATHERER_SET_RARITY_MAP =
    {
        DKM : { "Abyssal Specter" : "Uncommon", "Balduvian Bears" : "Common", "Balduvian Horde" : "Rare", "Barbed Sextant" : "Common", "Bounty of the Hunt" : "Uncommon", "Contagion" : "Uncommon", "Dark Banishing" : "Common", "Dark Ritual" : "Common", "Death Spark" : "Uncommon", "Elkin Bottle" : "Rare", "Elvish Bard" : "Uncommon", "Folk of the Pines" : "Common", "Forest" : "Basic Land", "Foul Familiar" : "Common", "Fyndhorn Elves" : "Common", "Giant Growth" : "Common", "Giant Trap Door Spider" : "", "Goblin Mutant" : "Uncommon", "Guerrilla Tactics" : "Common", "Hurricane" : "Uncommon", "Icy Manipulator" : "Uncommon", "Incinerate" : "Common", "Jokulhaups" : "Rare", "Karplusan Forest" : "Rare", "Lava Burst" : "Common", "Lhurgoyf" : "Rare", "Lim-Dûl's High Guard" : "Common", "Mountain" : "Basic Land", "Necropotence" : "Rare", "Orcish Cannoneers" : "Uncommon", "Phantasmal Fiend" : "Common", "Phyrexian War Beast" : "Common", "Pillage" : "Uncommon", "Pyroclasm" : "Uncommon", "Shatter" : "Common", "Soul Burn" : "Common", "Storm Shaman" : "Common", "Sulfurous Springs" : "Rare", "Swamp" : "Basic Land", "Underground River" : "Rare", "Walking Wall" : "Uncommon", "Woolly Spider" : "Common", "Yavimaya Ancients" : "Common", "Yavimaya Ants" : "Uncommon" },
        DPA : { "Air Elemental" : "Uncommon", "Boomerang" : "Common", "Cancel" : "Common", "Cloud Sprite" : "Common", "Counterbore" : "Rare", "Deluge" : "Uncommon", "Denizen of the Deep" : "Rare", "Essence Scatter" : "Common", "Evacuation" : "Rare", "Mahamoti Djinn" : "Rare", "Mind Control" : "Uncommon", "Mind Spring" : "Rare", "Negate" : "Common", "Phantom Warrior" : "Uncommon", "Snapping Drake" : "Common", "Thieving Magpie" : "Uncommon", "Unsummon" : "Common", "Abyssal Specter" : "Uncommon", "Ascendant Evincar" : "Rare", "Consume Spirit" : "Uncommon", "Crowd of Cinders" : "Uncommon", "Drudge Skeletons" : "Common", "Dusk Imp" : "Common", "Essence Drain" : "Common", "Eyeblight's Ending" : "Common", "Megrim" : "Uncommon", "Mind Rot" : "Common", "Mind Shatter" : "Rare", "Moonglove Winnower" : "Common", "Mortivore" : "Rare", "Ravenous Rats" : "Common", "Sengir Vampire" : "Rare", "Severed Legion" : "Common", "Terror" : "Common", "Underworld Dreams" : "Rare", "Unholy Strength" : "Common", "Act of Treason" : "Uncommon", "Banefire" : "Rare", "Blaze" : "Uncommon", "Bloodmark Mentor" : "Uncommon", "Cinder Pyromancer" : "Common", "Earth Elemental" : "Uncommon", "Enrage" : "Uncommon", "Furnace of Rath" : "Rare", "Goblin Piker" : "Common", "Goblin Sky Raider" : "Common", "Hill Giant" : "Common", "Incinerate" : "Common", "Kamahl, Pit Fighter" : "Rare", "Lightning Elemental" : "Common", "Prodigal Pyromancer" : "Uncommon", "Rage Reflection" : "Rare", "Shivan Dragon" : "Rare", "Shock" : "Common", "Blanchwood Armor" : "Uncommon", "Civic Wayfinder" : "Common", "Drove of Elves" : "Uncommon", "Duskdale Wurm" : "Uncommon", "Elven Riders" : "Uncommon", "Elvish Champion" : "Rare", "Elvish Eulogist" : "Common", "Elvish Promenade" : "Uncommon", "Elvish Visionary" : "Common", "Elvish Warrior" : "Common", "Gaea's Herald" : "Rare", "Giant Growth" : "Common", "Giant Spider" : "Common", "Greenweaver Druid" : "Uncommon", "Howl of the Night Pack" : "Uncommon", "Immaculate Magistrate" : "Rare", "Imperious Perfect" : "Uncommon", "Jagged-Scar Archers" : "Uncommon", "Lys Alana Huntmaster" : "Common", "Molimo, Maro-Sorcerer" : "Rare", "Natural Spring" : "Common", "Naturalize" : "Common", "Nature's Spiral" : "Uncommon", "Overrun" : "Uncommon", "Rampant Growth" : "Common", "River Boa" : "Uncommon", "Roughshod Mentor" : "Uncommon", "Runeclaw Bear" : "Common", "Spined Wurm" : "Common", "Talara's Battalion" : "Rare", "Trained Armodon" : "Common", "Troll Ascetic" : "Rare", "Verdant Force" : "Rare", "Vigor" : "Rare", "Wall of Wood" : "Common", "Coat of Arms" : "Rare", "Demon's Horn" : "Uncommon", "Dragon's Claw" : "Uncommon", "Kraken's Eye" : "Uncommon", "Loxodon Warhammer" : "Rare", "The Rack" : "Uncommon", "Wall of Spears" : "Common", "Wurm's Tooth" : "Uncommon" }
    };

    exports.SET_CORRECTIONS =
    {
    "*" :
    [
      "recalculateStandard",
      { match : {name : "Draco"}, replace : {text : "Domain — Draco costs {2} less to cast for each basic land type among lands you control.\nFlying\nDomain — At the beginning of your upkeep, sacrifice Draco unless you pay {10}. This cost is reduced by {2} for each basic land type among lands you control."}},
      { match : {name : "Spawnsire of Ulamog"}, replace : {text : "Annihilator 1 (Whenever this creature attacks, defending player sacrifices a permanent.)\n{4}: Create two 0/1 colorless Eldrazi Spawn creature tokens. They have \"Sacrifice this creature: Add {C} to your mana pool.\"\n{20}: Cast any number of Eldrazi cards you own from outside the game without paying their mana costs."}},
      { match : {name : "Jade Statue"}, remove : ["power", "toughness"] },
      { match : {name : "Ghostfire"}, remove : ["colors"] },
      { match : {name : "Will-O'-The-Wisp"}, replace : {name : "Will-o'-the-Wisp"}},
      { match : "*", replace : {text : {"roll {C}" : "roll CHAOS"}}},
      { match : {name : "Rhox"}, addPrinting : "S00"},
      { match : {name : "Nature's Cloak"}, replace : {text : "Green creatures you control gain forestwalk until end of turn. (They can't be blocked as long as defending player controls a Forest.)"}},
      { match : {name : "Regrowth"}, setLegality : {"Vintage" : "Legal"}},
      { match : {name : ["Argothian Wurm", "Barrin, Master Wizard", "Citanul Centaurs", "Gaea's Cradle", "Gilded Drake", "Great Whale", "Herald of Serra", "Karn, Silver Golem", "Lifeline", "Lightning Dragon", "Morphling", "Opal Archangel",
                 "Serra's Sanctum", "Tolarian Academy", "Temporal Aperture", "Time Spiral", "Yawgmoth's Will", "Zephid", "Deranged Hermit", "Grim Monolith", "Memory Jar", "Multani, Maro-Sorcerer", "Palinchron", "Radiant, Archangel", "Ring of Gix", "Second Chance", "Weatherseed Treefolk", "Academy Rector", "Carnival of Souls", "Covetous Dragon", "Donate", "Masticore", "Metalworker", "Opalescence", "Phyrexian Negator", "Powder Keg", "Rofellos, Llanowar Emissary", "Replenish", "Treachery",
                 "Yavimaya Hollow", "Yawgmoth's Bargain", "Ancestral Recall", "Badlands", "Bayou", "Black Lotus", "Blaze of Glory", "Braingeyser", "Chaos Orb", "Contract from Below", "Copy Artifact", "Cyclopean Tomb", "Darkpact", "Demonic Attorney", "Demonic Hordes", "Farmstead",
                 "Fastbond", "Forcefield", "Fork", "Gauntlet of Might", "Granite Gargoyle", "Illusionary Mask", "Kudzu", "Lich", "Mox Emerald", "Mox Jet", "Mox Pearl", "Mox Ruby", "Mox Sapphire", "Natural Selection",
                 "Plateau", "Raging River", "Roc of Kher Ridges", "Rock Hydra", "Savannah", "Scrubland", "Sedge Troll", "Taiga", "Time Vault", "Time Walk", "Timetwister", "Tropical Island", "Tundra", "Two-Headed Giant of Foriys",
                 "Underground Sea", "Vesuvan Doppelganger", "Veteran Bodyguard", "Volcanic Island", "Wheel of Fortune", "Word of Command", "Ali from Cairo", "Bazaar of Baghdad", "City in a Bottle", "Diamond Valley", "Drop of Honey", "Elephant Graveyard", "Guardian Beast", "Ifh-Bíff Efreet", "Island of Wak-Wak", "Jihad", "Juzám Djinn", "Khabál Ghoul",
                 "King Suleiman", "Library of Alexandria", "Merchant Ship", "Old Man of the Sea", "Pyramids", "Ring of Ma'rûf", "Sandals of Abdallah", "Serendib Djinn", "Shahrazad", "Singing Tree", "Argivian Archaeologist", "Candelabra of Tawnos", "Citanul Druid", "Damping Field", "Gaea's Avenger", "Gate to Phyrexia", "Golgothian Sylex", "Haunting Wind", "Martyrs of Korlis", "Mightstone",
                 "Mishra's Workshop", "Power Artifact", "Powerleech", "Su-Chi", "Tawnos's Coffin", "Transmute Artifact", "Urza's Miter", "Weakstone", "The Abyss", "Acid Rain", "Adun Oakenshield", "Al-abara's Carpet", "Alchor's Tomb", "All Hallow's Eve", "Angus Mackenzie", "Bartel Runeaxe", "Boris Devilboon", "Caverns of Despair", "Chains of Mephistopheles",
                 "Cleanse", "Disharmony", "Divine Intervention", "Elder Spawn", "Eureka", "Falling Star", "Field of Dreams", "Firestorm Phoenix", "Forethought Amulet", "Gosta Dirk", "Gravity Sphere", "Gwendlyn Di Corci",
                 "Halfdane", "Hazezon Tamar", "Hellfire", "Imprison", "In the Eye of Chaos", "Infinite Authority", "Invoke Prejudice", "Jacques le Vert", "Jovial Evil", "Knowledge Vault", "Kobold Overlord", "Lady Caleria",
                 "Lady Evangela", "Land Equilibrium", "Life Matrix", "Lifeblood", "Living Plane", "Livonya Silone", "Mana Matrix", "Master of the Hunt", "Mirror Universe", "Moat", "Mold Demon", "Nether Void", "North Star",
                 "Nova Pentacle", "Pixie Queen", "Planar Gate", "Quarum Trench Gnomes", "Ragnar", "Ramses Overdark", "Rapid Fire", "Rasputin Dreamweaver", "Reverberation", "Ring of Immortals", "Rohgahh of Kher Keep",
                 "Spinal Villain", "Spiritual Sanctuary", "Storm World", "Sword of the Ages", "The Tabernacle at Pendrell Vale", "Telekinesis", "Tetsuo Umezawa", "Thunder Spirit", "Tuknir Deathlock",
                 "Typhoon", "Ur-Drago", "Willow Satyr", "Wood Elemental", "City of Shadows", "Cleansing", "Eternal Flame", "Exorcist", "Frankenstein's Monster", "Goblin Wizard", "Grave Robbers", "Hidden Path", "Knights of Thorn", "Lurker", "Mana Vortex", "Martyr's Cry",
                 "Nameless Race", "Niall Silvain", "Preacher", "Psychic Allergy", "Scarwood Bandits", "Season of the Witch", "Sorrow's Path", "Stone Calendar", "Tracker", "Worms of the Earth", "Wormwood Treefolk", "Aeolipile", "Balm of Restoration", "Conch Horn", "Delif's Cube", "Draconian Cylix", "Dwarven Armorer", "Ebon Praetor", "Elven Lyre", "Elvish Farmer", "Fungal Bloom", "Goblin Flotilla", "Hand of Justice",
                 "Homarid Shaman", "Icatian Lieutenant", "Icatian Skirmishers", "Implements of Sacrifice", "Rainbow Vale", "Ring of Renewal", "River Merfolk", "Spirit Shield", "Thelon's Curse", "Thelonite Monk", "Thrull Champion",
                 "Tourach's Gate", "Vodalian Knights", "Vodalian War Machine", "Zelyon Sword", "Aegis of the Meek", "Altar of Bone", "Amulet of Quoz", "Balduvian Hydra", "Blizzard", "Brand of Ill Omen", "Call to Arms", "Chromatic Armor", "Earthlink", "Energy Storm", "Flow of Maggots", "Formation", "Fyndhorn Pollen",
                 "General Jarkeld", "Glacial Crevasses", "Gravebind", "Halls of Mist", "Hot Springs", "Ice Cauldron", "Illusionary Presence", "Illusions of Grandeur", "Infernal Denizen", "Jester's Mask", "Kjeldoran Knight",
                 "Kjeldoran Phalanx", "Land Cap", "Lava Tubes", "Lightning Blow", "Márton Stromgald", "Mercenaries", "Mesmeric Trance", "Minion of Tevesh Szat", "Mountain Titan", "Mudslide", "Musician", "Mystic Might", "Polar Kraken",
                 "Reality Twist", "River Delta", "Ritual of Subdual", "Skeleton Ship", "Snowblind", "Soldevi Golem", "Spoils of Evil", "Spoils of War", "Storm Spirit", "Timberline Ridge", "Trailblazer",
                 "Veldt", "Winter's Chill", "An-Zerrin Ruins", "Anaba Ancestor", "Anaba Spirit Crafter", "Apocalypse Chime", "Autumn Willow", "Aysen Crusader", "Aysen Highway", "Baki's Curse", "Baron Sengir", "Beast Walkers", "Black Carriage", "Chain Stasis",
                 "Daughter of Autumn", "Didgeridoo", "Dwarven Pony", "Dwarven Sea Clan", "Faerie Noble", "Grandmother Sengir", "Hazduhr the Abbot", "Heart Wolf", "Koskun Falls", "Leeches", "Mammoth Harness", "Marjhan", "Mystic Decree",
                 "Narwhal", "Reveka, Wizard Savant", "Rysorian Badger", "Serra Aviary", "Soraya the Falconer", "Timmerian Fiends", "Veldrane of Sengir", "Wall of Kelp", "Willow Priestess", "Winter Sky", "Ashnod's Cylix", "Balduvian Trading Post", "Chaos Harlequin", "Dystopia", "Fatal Lore", "Floodwater Dam", "Gargantuan Gorilla", "Gustha's Scepter", "Heart of Yavimaya", "Helm of Obedience", "Ivory Gargoyle",
                 "Kaysa", "Keeper of Tresserhorn", "Kjeldoran Outpost", "Krovikan Horror", "Lake of the Dead", "Lodestone Bauble", "Lord of Tresserhorn", "Misfortune", "Nature's Wrath", "Omen of Fire", "Phantasmal Sphere",
                 "Phelddagrif", "Phyrexian Devourer", "Phyrexian Portal", "Ritual of the Machine", "Rogue Skycaptain", "Royal Decree", "Sheltered Valley", "Soldevi Digger", "Soldevi Excavations", "Splintering Wind", "Sustaining Spirit",
                 "Sworn Defender", "Thawing Glaciers", "Thought Lash", "Tidal Control", "Tornado", "Varchild's War-Riders", "Wandering Mage", "Winter's Night", "Acidic Dagger", "Afiya Grove", "Amulet of Unmaking", "Asmira, Holy Avenger", "Auspicious Ancestor", "Barreling Attack", "Bazaar of Wonders", "Benthic Djinn", "Bone Mask", "Brushwagg", "Cadaverous Bloom",
                 "Canopy Dragon", "Carrion", "Catacomb Dragon", "Chaosphere", "Circle of Despair", "Cycle of Life", "Discordant Spirit", "Divine Retribution", "Emberwilde Caliph", "Emberwilde Djinn", "Energy Bolt", "Energy Vortex",
                 "Forsaken Wastes", "Frenetic Efreet", "Grim Feast", "Hakim, Loreweaver", "Hall of Gemstone", "Harbinger of Night", "Hivis of the Scale", "Jabari's Influence", "Jungle Patrol", "Kukemssa Pirates", "Leering Gargoyle",
                 "Lion's Eye Diamond", "Lure of Prey", "Malignant Growth", "Mangara's Tome", "Mindbender Spores", "Misers' Cage", "Mist Dragon", "Natural Balance", "Null Chamber", "Paupers' Cage", "Phyrexian Dreadnought", "Phyrexian Purge",
                 "Phyrexian Tribute", "Political Trickery", "Preferred Selection", "Prismatic Lace", "Purgatory", "Purraj of Urborg", "Rashida Scalebane", "Razor Pendulum", "Reflect Damage", "Reparations", "Rock Basilisk", "Sawback Manticore",
                 "Seeds of Innocence", "Shallow Grave", "Shauku, Endbringer", "Shimmer", "Sidar Jabari", "Soul Echo", "Spectral Guardian", "Spirit of the Night", "Subterranean Spirit", "Tainted Specter", "Taniwha", "Teeka's Dragon",
                 "Teferi's Imp", "Teferi's Isle", "Telim'Tor", "Telim'Tor's Edict", "Tombstone Stairwell", "Torrent of Lava", "Unfulfilled Desires", "Ventifact Bottle", "Warping Wurm", "Wellspring",
                 "Yare", "Zirilan of the Claw", "Zuberi, Golden Feather", "Aku Djinn", "Anvil of Bogardan", "Bogardan Phoenix", "Breathstealer's Crypt", "Chronatog", "City of Solitude", "Corrosion", "Diamond Kaleidoscope", "Elkin Lair", "Equipoise", "Eye of Singularity", "Femeref Enchantress",
                 "Firestorm Hellkite", "Flooded Shoreline", "Forbidden Ritual", "Griffin Canyon", "Guiding Spirit", "Kaervek's Spite", "Katabatic Winds", "Kookus", "Lichenthrope", "Lightning Cloud", "Ogre Enforcer", "Phyrexian Marauder",
                 "Pillar Tombs of Aku", "Pygmy Hippo", "Quirion Druid", "Rainbow Efreet", "Retribution of the Meek", "Righteous War", "Sands of Time", "Squandered Resources", "Suleiman's Legacy", "Teferi's Realm", "Three Wishes", "Tithe",
                 "Triangle of War", "Undiscovered Paradise", "Viashivan Dragon", "Zhalfirin Crusader", "Abeyance", "Aboroth", "Ancestral Knowledge", "Avizoa", "Bone Dancer", "Bösium Strip", "Bubble Matrix", "Debt of Loyalty", "Dwarven Thaumaturgist", "Ertai's Familiar", "Firestorm", "Fungus Elemental", "Gallowbraid",
                 "Goblin Bomb", "Heart of Bogardan", "Heat Stroke", "Infernal Tribute", "Inner Sanctum", "Liege of the Hollows", "Lotus Vale", "Mana Web", "Maraxus of Keld", "Morinfen", "Mwonvuli Ooze", "Null Rod", "Paradigm Shift",
                 "Peacekeeper", "Pendrell Mists", "Psychic Vortex", "Scorched Ruins", "Thran Tome", "Tolarian Entrancer", "Tolarian Serpent", "Urborg Justice", "Urborg Stalker", "Wave of Terror", "Well of Knowledge",
                 "Winding Canyons", "Xanthic Statue", "Aluren", "Apocalypse", "Avenging Angel", "Commander Greven il-Vec", "Corpse Dance", "Cursed Scroll", "Earthcraft", "Eladamri, Lord of Leaves", "Escaped Shapeshifter", "Humility", "Intuition", "Meditate", "Orim, Samite Healer",
                 "Recycle", "Sarcomancy", "Selenia, Dark Angel", "Crovax the Cursed", "Dream Halls", "Mox Diamond", "Silver Wyvern", "Sliver Queen", "Volrath's Shapeshifter", "Volrath's Stronghold", "City of Traitors", "Dominating Licid", "Ertai, Wizard Adept", "Exalted Dragon", "Hatred", "Mind Over Matter", "Oath of Ghouls", "Recurring Nightmare", "Survival of the Fittest"]},
        replace : {reserved : true}},
      { match : {layout : ["plane", "phenomenon"]}, deleteLegality : ["Vintage", "Commander", "Legacy"]},
      { match : {name : ["Advantageous Proclamation","Amulet of Quoz","Ancestral Recall","Backup Plan","Balance","Biorhythm","Black Lotus","Brago's Favor","Braids, Cabal Minion","Bronze Tablet","Chaos Orb","Coalition Victory","Channel","Contract from Below","Darkpact","Demonic Attorney","Double Stroke","Emrakul, the Aeons Torn","Erayo, Soratami Ascendant","Falling Star","Fastbond","Gifts Ungiven","Griselbrand","Immediate Action","Iterative Analysis","Jeweled Bird","Karakas","Library of Alexandria","Limited Resources","Mox Emerald","Mox Jet","Mox Pearl","Mox Ruby","Mox Sapphire","Muzzio's Preparations","Painter's Servant","Panoptic Mirror","Power Play","Primeval Titan","Protean Hulk","Rebirth","Recurring Nightmare","Rofellos, Llanowar Emissary","Secret Summoning","Secrets of Paradise","Sentinel Dispatch","Shahrazad","Sundering Titan","Sway of the Stars","Sylvan Primordial","Tempest Efreet","Time Vault","Time Walk","Timmerian Fiends","Tinker","Tolarian Academy","Trade Secrets","Unexpected Potential","Upheaval","Worldfire","Worldknit","Yawgmoth's Bargain"]},
             setLegality : {"Commander" : "Banned"}}
    ]
  };

  var requireDir = require('require-dir');
  var setConfigs = requireDir('./set_configs', {'recurse': true});
  var configStack = [setConfigs];  // LIFO stack of configs or trees containing configs

  exports.SETS = [];
  while (configStack.length > 0) {
      var config = configStack.pop();
      if (typeof config.SET === 'undefined') {
          for (var child in config)
            configStack.push(config[child]);
          continue;
      }

      var set = config.SET;
      var corrections = (typeof config.SET_CORRECTIONS !== 'undefined') ? config.SET_CORRECTIONS : [];
      if (set.isMCISet)
        corrections.push({match : "*", fixFlavorNewlines:true});

      exports.SETS.push(set);
      exports.SET_CORRECTIONS[set.code] = corrections;
  }

  exports.SET_SPOILER_IMAGE_DIFF_SRC_NUMBER =
  {
    KTK :
    {
      "Abzan Falconer" : 3,
      "Bloodstained Mire" : 1,
      "Embodiment of Spring" : 2,
      "Flooded Strand" : 1,
      "Polluted Delta" : 1,
      "Windswept Heath" : 1,
      "Wooded Foothills" : 1,
      "Thousand Winds" : 3
    }
  };

  exports.ARTIST_CORRECTIONS = {
    "Brian Snõddy"                        : ["Brian Snōddy", "Brian Snoddy", "Brian Snøddy"],
    "Paolo Parente & Brian Snõddy"        : ["Parente & Brian Snoddy"],
    "Dennis Detwiller"                    : ["Dennis Detwiler", "Denise Detwiler"],
    "Diana Vick"                          : ["Diane Vick"],
    "Douglas Shuler"                      : ["Douglas Schuler"],
    "Edward P. Beard, Jr."                : ["Edward P. Beard, Jr", "Edward Beard, Jr.", "Edward P. Beard Jr."],
    "Jon J Muth"                          : ["Jon J. Muth", "John J. Muth"],
    "Ken Meyer, Jr."                      : ["Ken Meyer Jr."],
    "Kerstin Kaman"                       : ["Kersten Kaman"],
    "L. A. Williams"                      : ["L.A. Williams"],
    "Melissa A. Benson"                   : ["Melissa Benson"],
    "Ron Spencer"                         : ["ROn Spencer"],
    "Richard Kane Ferguson"               : ["Richard Kane-Ferguson"],
    "Sam Wood"                            : ["Sam Woods"],
    "Steve White"                         : ["Steven White"],
    "Tim Hildebrandt"                     : ["Tim Hilderbrandt"],
    "Zoltan Boros & Gabor Szikszai"       : ["Zoltan Boras & Gabor Szikszai"],
    "Bradley Williams"                    : ["Brad Williams"],
    "Christopher Rush"                    : ["Christoper Rush"],
    "Z. Plucinski & D. Alexander Gregory" : ["Z. Plucinski & D.A. Gregory"],
    "Dave Kendall"                        : ["Daven Kendall"],
    "DiTerlizzi"                          : ["DiTerrlizzi"],
    "Tony Diterlizzi"                     : ["Tony DiTerlizzi"],
    "Dom!"                                : ["Dom"],
    "Geofrey Darrow"                      : ["G. Darrow"],
    "Henry G. Higgenbotham"               : ["Henry G. Higginbotham"],
    "Jarreau Wimberly"                    : ["Jarreau Wimberley"],
    "Kev Walker"                          : ["Kevin Walker"],
    "Lucio Parrillo"                      : ["Lucio Patrillo"],
    "Mark A. Nelson"                      : ["Mark Nelson"],
    "Matt Stewart"                        : ["Matt Steward"],
    "Matthew D. Wilson"                   : ["Matthew Wilson"],
    "Paolo Parente"                       : ["Parente"],
    "Randy Asplund-Faith"                 : ["Randy Asplund"],
    "Romas Kukalis"                       : ["Romas"],
    "Scott M. Fischer"                    : ["Scott M. Fisher"],
    "Trevor Claxton"                      : ["Trevon Claxton"]
  };

  exports.SYMBOL_RARITIES = {c:["common"], u : ["uncommon"], r : ["rare"], m : ["mythic", "mythic rare", "mythicrare"], s : ["special"]};
  exports.SYMBOL_SIZES = [8, 16, 24, 32, 48, 64, 96, 128, 256, 512, 768, 1024];
  exports.SETS_WITH_BONUS_RARITIES = ["VMA"];

  exports.ALLOW_ESSENTIAL_FLAVOR_MISMATCH =
  {
    "4ED" : [2283, 2296, 2311]
  };

  exports.SYMBOL_MANA = {
    w : ["white"],
    u : ["blue"],
    b : ["black"],
    r : ["red"],
    g : ["green"],
    s : ["snow"],
    c : ["colorless"],
    e : ['energy'],
    "0" : ["zero"],
    "1" : ["one"],
    "2" : ["two"],
    "3" : ["three"],
    "4" : ["four"],
    "5" : ["five"],
    "6" : ["six"],
    "7" : ["seven"],
    "8" : ["eight"],
    "9" : ["nine"],
    "10" : ["ten"],
    "11" : ["eleven"],
    "12" : ["twelve"],
    "13" : ["thirteen"],
    "14" : ["fourteen"],
    "15" : ["fifteen"],
    "16" : ["sixteen"],
    "17" : ["seventeen"],
    "18" : ["eighteen"],
    "19" : ["nineteen"],
    "20" : ["twenty"],
    "100" : ["onehundred", "hundred"],
    "1000000" : ["onemillion", "million"],
    x : [],
    y : [],
    z : [],
    wu : ["whiteblue", "bluewhite", "uw"],
    wb : ["whiteblack", "blackwhite", "bw"],
    ub : ["blueblack", "blackblue", "bu"],
    ur : ["bluered", "redblue", "ru"],
    br : ["blackred", "redblack", "rb"],
    bg : ["blackgreen", "greenblack", "gb"],
    rg : ["redgreen", "greenred", "gr"],
    rw : ["redwhite", "whitered", "wr"],
    gw : ["greenwhite", "whitegreen", "wg"],
    gu : ["greenblue", "bluegreen", "ug"],
    "2w" : ["twowhite", "2white", "whitetwo", "w2", "white2"],
    "2u" : ["twoblue", "2blue", "bluetwo", "u2", "blue2"],
    "2b" : ["twoblack", "2black", "blacktwo", "b2", "black2"],
    "2r" : ["twored", "2red", "redtwo", "r2", "red2"],
    "2g" : ["twogreen", "2green", "greentwo", "g2", "green2"],
    p : ["phyrexian"],
    pw : ["phyrexianwhite", "pwhite", "whitephyrexian", "whitep", "wp", "wphyrexian"],
    pu : ["phyrexianblue", "pblue", "bluephyrexian", "bluep", "up", "uphyrexian"],
    pb : ["phyrexianblack", "pblack", "blackphyrexian", "blackp", "bp", "bphyrexian"],
    pr : ["phyrexianred", "pred", "redphyrexian", "redp", "rp", "rphyrexian"],
    pg : ["phyrexiangreen", "pgreen", "greenphyrexian", "greenp", "gp", "gphyrexian"],
    "∞" : ["infinity"],
    h : ["half", "halfcolorless", "colorlesshalf"],
    hw : ["halfwhite", "halfw", "whitehalf", "whalf", "wh", "whiteh"],
    hu : ["halfblue", "halfu", "bluehalf", "uhalf", "uh", "blueh"],
    hb : ["halfblack", "halfb", "blackhalf", "bhalf", "bh", "blackh"],
    hr : ["halfred", "halfr", "redhalf", "rhalf", "rh", "redh"],
    hg : ["halfgreen", "halfg", "greenhalf", "ghalf", "gh", "greenh"]
  };

  exports.SYMBOL_OTHER = {
    t : ["tap"],
    q : ["untap"],
    artifact : [],
    creature : [],
    enchantment : [],
    instant : [],
    land : [],
    multiple : [],
    planeswalker : [],
    sorcery : [],
    power : [],
    toughness : [],
    chaosdice : ["chaos", "c"],
    planeswalk : [],
    forwardslash : [],
    tombstone : []
  };

  exports.FIELD_TYPES = {
    layout        : "string",
    name          : "string",
    names         : ["string"],
    manaCost      : "string",
    cmc           : "number",
    colors        : ["string"],
    type          : "string",
    supertypes    : ["string"],
    types         : ["string"],
    subtypes      : ["string"],
    rarity        : "string",
    text          : "string",
    flavor        : "string",
    artist        : "string",
    number        : "string",
    power         : "string",
    toughness     : "string",
    loyalty       : "number",
    multiverseid  : "number",
    imageName     : "string",
    watermark     : "string",
    border        : "string",
    hand          : "number",
    life          : "number",
    rulings       : ["object"],
    foreignNames  : ["object"],
    printings     : ["string"],
    originalText  : "string",
    variations    : ["number"],
    originalType  : "string",
    timeshifted   : "boolean",
    reserved      : "boolean",
    source        : "string",
    releaseDate   : "string",
    legalities    : ["object"],
    starter       : "boolean",
    id            : "string",
    colorIdentity : ["string"]
  };

  exports.ORACLE_FIELDS = ["layout", "name", "names", "manaCost", "cmc", "colors", "type", "supertypes", "types", "subtypes", "text", "power", "toughness", "loyalty", "hand", "life", "rulings", "printings", "legalities"];
  exports.INTERNAL_ONLY_FIELDS = ["variations"];
  exports.EXTRA_FIELDS = ["rulings", "foreignNames", "printings", "originalText", "originalType", "legalities", "source"];
  exports.SET_SPECIFIC_FIELDS = ["rarity", "artist", "flavor", "number", "multiverseid", "variations", "watermark", "border", "timeshifted", "reserved", "releaseDate", "originalText", "originalType", "id", "foreignNames"];

  exports.VINTAGE_BANNED = [
    "Advantageous Proclamation",
    "Amulet of Quoz",
    "Backup Plan",
    "Brago's Favor",
    "Bronze Tablet",
    "Chaos Orb",
    "Contract from Below",
    "Darkpact",
    "Demonic Attorney",
    "Double Stroke",
    "Falling Star",
    "Immediate Action",
    "Iterative Analysis",
    "Jeweled Bird",
    "Muzzio's Preparations",
    "Power Play",
    "Rebirth",
    "Secret Summoning",
    "Secrets of Paradise",
    "Sentinel Dispatch",
    "Shahrazad",
    "Tempest Efreet",
    "Timmerian Fiends",
    "Unexpected Potential",
    "Worldknit"
  ];

  exports.VINTAGE_RESTRICTED = [
    "Ancestral Recall",
    "Balance",
    "Black Lotus",
    "Brainstorm",
    "Channel",
    "Demonic Consultation",
    "Demonic Tutor",
    "Fastbond",
    "Flash",
    "Gifts Ungiven",
    "Imperial Seal",
    "Library of Alexandria",
    "Lion’s Eye Diamond",
    "Lotus Petal",
    "Mana Crypt",
    "Mana Vault",
    "Memory Jar",
    "Merchant Scroll",
    "Mind’s Desire",
    "Mox Emerald",
    "Mox Jet",
    "Mox Pearl",
    "Mox Ruby",
    "Mox Sapphire",
    "Mystical Tutor",
    "Necropotence",
    "Ponder",
    "Sol Ring",
    "Strip Mine",
    "Thirst for Knowledge",
    "Time Vault",
    "Time Walk",
    "Timetwister",
    "Tinker",
    "Tolarian Academy",
    "Trinisphere",
    "Vampiric Tutor",
    "Wheel of Fortune",
    "Windfall",
    "Yawgmoth’s Bargain",
    "Yawgmoth’s Will"
  ];

  exports.VALID_LANGUAGES = [
    "Chinese Simplified",
    "Chinese Traditional",
    "French",
    "German",
    "Italian",
    "Japanese",
    "Portuguese (Brazil)",
    "Russian",
    "Spanish",
    "Korean"
  ];

  exports.MCI_LANGUAGE_TO_GATHERER = {
    "Portuguese"          : "Portuguese (Brazil)",
    "Simplified Chinese"  : "Chinese Simplified",
    "Traditional Chinese" : "Chinese Traditional"
  };

  exports.VALID_COLORS = [ 'W', 'U', 'B', 'R', 'G' ];

  exports.STANDARD_SETS = [
    'KLD',
    'AER',
    'AKH',
    'W17',
    'HOU',
    'XLN'
  ];

})(typeof exports==="undefined" ? window.C={} : exports);
