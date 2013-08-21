"use strict";

(function(exports)
{
    var base = (typeof process!=="undefined" && typeof process.versions!=="undefined" && typeof process.versions.node!=="undefined") ? require("base") : window.base;

	exports.SUPERTYPES = ["Basic", "Legendary", "Snow", "World"];
	exports.TYPES = ["Instant", "Sorcery", "Artifact", "Creature", "Enchantment", "Land", "Planeswalker", "Tribal", "Plane", "Phenomenon", "Scheme", "Vanguard"];

	// Unglued/Unhinged types
	exports.TYPES.push("Enchant", "Player", "Summon", "Interrupt", "Scariest", "You'll", "Ever", "See", "Eaturecray");

	exports.SETS =
	[
		{
			name : "Limited Edition Alpha",
			code : "LEA",
			releaseDate : "1993-08-05",
			border : "black",
			type : "core"
		},
		{
			name : "Limited Edition Beta",
			code : "LEB",
			releaseDate : "1993-10-01",
			border : "black",
			type : "core"
		},
		{
			name : "Arabian Nights",
			code : "ARN",
			releaseDate : "1993-12-01",
			border : "black",
			type : "expansion"
		},
		{
			name : "Unlimited Edition",
			code : "2ED",
			releaseDate : "1993-12-01",
			border : "white",
			type : "core"
		},
		{
			name : "Antiquities",
			code : "ATQ",
			releaseDate : "1994-03-01",
			border : "black",
			type : "expansion"
		},
		{
			name : "Revised Edition",
			code : "3ED",
			releaseDate : "1994-04-01",
			border : "white",
			type : "core"
		},
		{
			name : "Legends",
			code : "LEG",
			releaseDate : "1994-06-01",
			border : "black",
			type : "expansion"
		},
		{
			name : "The Dark",
			code : "DRK",
			releaseDate : "1994-08-01",
			border : "black",
			type : "expansion"
		},
		{
			name : "Fallen Empires",
			code : "FEM",
			releaseDate : "1994-11-01",
			border : "black",
			type : "expansion"
		},
		{
			name : "Fourth Edition",
			code : "4ED",
			releaseDate : "1995-04-01",
			border : "white",
			type : "core"
		},
		{
			name : "Ice Age",
			code : "ICE",
			releaseDate : "1995-06-01",
			border : "black",
			type : "expansion",
			block : "Ice Age"
		},
		{
			name : "Chronicles",
			code : "CHR",
			releaseDate : "1995-07-01",
			border : "white",
			type : "reprint"
		},
		{
			name : "Homelands",
			code : "HML",
			releaseDate : "1995-10-01",
			border : "black",
			type : "expansion"
		},
		{
			name : "Alliances",
			code : "ALL",
			releaseDate : "1996-06-10",
			border : "black",
			type : "expansion",
			block : "Ice Age"
		},
		{
			name : "Mirage",
			code : "MIR",
			releaseDate : "1996-10-08",
			border : "black",
			type : "expansion",
			block : "Mirage"
		},
		{
			name : "Visions",
			code : "VIS",
			releaseDate : "1997-02-03",
			border : "black",
			type : "expansion",
			block : "Mirage"
		},
		{
			name : "Fifth Edition",
			code : "5ED",
			releaseDate : "1997-03-24",
			border : "white",
			type : "core"
		},
		{
			name : "Portal",
			code : "POR",
			releaseDate : "1997-05-01",
			border : "black",
			type : "starter"
		},
		{
			name : "Weatherlight",
			code : "WTH",
			releaseDate : "1997-06-09",
			border : "black",
			type : "expansion",
			block : "Mirage"
		},
		{
			name : "Tempest",
			code : "TMP",
			releaseDate : "1997-10-14",
			border : "black",
			type : "expansion",
			block : "Tempest"
		},
		{
			name : "Stronghold",
			code : "STH",
			releaseDate : "1998-03-02",
			border : "black",
			type : "expansion",
			block : "Tempest"
		},
		{
			name : "Portal Second Age",
			code : "PO2",
			releaseDate : "1998-06-01",
			border : "black",
			type : "starter"
		},
		{
			name : "Exodus",
			code : "EXO",
			releaseDate : "1998-06-15",
			border : "black",
			type : "expansion",
			block : "Tempest"
		},
		{
			name : "Unglued",
			code : "UGL",
			releaseDate : "1998-08-11",
			border : "silver",
			type : "un"
		},
		{
			name : "Urza's Saga",
			code : "USG",
			releaseDate : "1998-10-12",
			border : "black",
			type : "expansion",
			block : "Urza's"
		},
		{
			name : "Urza's Legacy",
			code : "ULG",
			releaseDate : "1999-02-15",
			border : "black",
			type : "expansion",
			block : "Urza's"
		},
		{
			name : "Classic Sixth Edition",
			code : "6ED",
			releaseDate : "1999-04-21",
			border : "white",
			type : "core"
		},
		{
			name : "Portal Three Kingdoms",
			code : "PTK",
			releaseDate : "1999-05-01",
			border : "white",
			type : "starter"
		},
		{
			name : "Urza's Destiny",
			code : "UDS",
			releaseDate : "1999-06-07",
			border : "black",
			type : "expansion",
			block : "Urza's"
		},
		{
			name : "Starter 1999",
			code : "S99",
			releaseDate : "1999-07-01",
			border : "white",
			type : "starter"
		},
		{
			name : "Mercadian Masques",
			code : "MMQ",
			releaseDate : "1999-10-04",
			border : "black",
			type : "expansion",
			block : "Masques"
		},
		{
			name : "Battle Royale Box Set",
			code : "BRB",
			releaseDate : "1999-11-12",
			border : "white",
			type : "box"
		},
		{
			name : "Nemesis",
			code : "NMS",
			releaseDate : "2000-02-14",
			border : "black",
			type : "expansion",
			block : "Masques"			
		},
		{
			name : "Starter 2000",
			code : "S00",
			releaseDate : "2000-04-01",
			border : "white",
			type : "starter"
		},
		{
			name : "Prophecy",
			code : "PCY",
			releaseDate : "2000-06-05",
			border : "black",
			type : "expansion",
			block : "Masques"
		},
		{
			name : "Beatdown Box Set",
			code : "BTD",
			releaseDate : "2000-10-01",
			border : "white",
			type : "box"
		},
		{
			name : "Invasion",
			code : "INV",
			releaseDate : "2000-10-02",
			border : "black",
			type : "expansion",
			block : "Invasion"
		},
		{
			name : "Planeshift",
			code : "PLS",
			releaseDate : "2001-02-05",
			border : "black",
			type : "expansion",
			block : "Invasion"
		},
		{
			name : "Seventh Edition",
			code : "7ED",
			releaseDate : "2001-04-11",
			border : "white",
			type : "core"
		},
		{
			name : "Apocalypse",
			code : "APC",
			releaseDate : "2001-06-04",
			border : "black",
			type : "expansion",
			block : "Invasion"
		},
		{
			name : "Odyssey",
			code : "ODY",
			releaseDate : "2001-10-01",
			border : "black",
			type : "expansion",
			block : "Odyssey"
		},
		{
			name : "Torment",
			code : "TOR",
			releaseDate : "2002-02-04",
			border : "black",
			type : "expansion",
			block : "Odyssey"
		},
		{
			name : "Judgment",
			code : "JUD",
			releaseDate : "2002-05-27",
			border : "black",
			type : "expansion",
			block : "Odyssey"
		},
		{
			name : "Onslaught",
			code : "ONS",
			releaseDate : "2002-10-07",
			border : "black",
			type : "expansion",
			block : "Onslaught"
		},
		{
			name : "Legions",
			code : "LGN",
			releaseDate : "2003-02-03",
			border : "black",
			type : "expansion",
			block : "Onslaught"
		},
		{
			name : "Scourge",
			code : "SCG",
			releaseDate : "2003-05-26",
			border : "black",
			type : "expansion",
			block : "Onslaught"
		},
		{
			name : "Eighth Edition",
			code : "8ED",
			releaseDate : "2003-07-28",
			border : "white",
			type : "core"
		},
		{
			name : "Mirrodin",
			code : "MRD",
			releaseDate : "2003-10-02",
			border : "black",
			type : "expansion",
			block : "Mirrodin"
		},
		{
			name : "Darksteel",
			code : "DST",
			releaseDate : "2004-02-06",
			border : "black",
			type : "expansion",
			block : "Mirrodin"
		},
		{
			name : "Fifth Dawn",
			code : "5DN",
			releaseDate : "2004-06-04",
			border : "black",
			type : "expansion",
			block : "Mirrodin"
		},
		{
			name : "Champions of Kamigawa",
			code : "CHK",
			releaseDate : "2004-10-01",
			border : "black",
			type : "expansion",
			block : "Kamigawa"
		},
		{
			name : "Unhinged",
			code : "UNH",
			releaseDate : "2004-11-20",
			border : "silver",
			type : "un"
		},
		{
			name : "Betrayers of Kamigawa",
			code : "BOK",
			releaseDate : "2005-02-04",
			border : "black",
			type : "expansion",
			block : "Kamigawa"
		},
		{
			name : "Saviors of Kamigawa",
			code : "SOK",
			releaseDate : "2005-06-03",
			border : "black",
			type : "expansion",
			block : "Kamigawa"
		},
		{
			name : "Ninth Edition",
			code : "9ED",
			releaseDate : "2005-07-29",
			border : "white",
			type : "core"
		},
		{
			name : "Ravnica: City of Guilds",
			code : "RAV",
			releaseDate : "2005-10-07",
			border : "black",
			type : "expansion",
			block : "Ravnica"
		},
		{
			name : "Guildpact",
			code : "GPT",
			releaseDate : "2006-02-03",
			border : "black",
			type : "expansion",
			block : "Ravnica"
		},
		{
			name : "Dissension",
			code : "DIS",
			releaseDate : "2006-05-05",
			border : "black",
			type : "expansion",
			block : "Ravnica"
		},
		{
			name : "Coldsnap",
			code : "CSP",
			releaseDate : "2006-07-21",
			border : "black",
			type : "expansion",
			block : "Ice Age"
		},
		{
			name : "Time Spiral",
			code : "TSP",
			releaseDate : "2006-10-06",
			border : "black",
			type : "expansion",
			block : "Time Spiral"
		},
		{
			name : "Planar Chaos",
			code : "PLC",
			releaseDate : "2007-02-02",
			border : "black",
			type : "expansion",
			block : "Time Spiral"
		},
		{
			name : "Future Sight",
			code : "FUT",
			releaseDate : "2007-05-04",
			border : "black",
			type : "expansion",
			block : "Time Spiral"
		},
		{
			name : "Tenth Edition",
			code : "10E",
			releaseDate : "2007-07-13",
			border : "black",
			type : "core"
		},
		{
			name : "Lorwyn",
			code : "LRW",
			releaseDate : "2007-10-12",
			border : "black",
			type : "expansion",
			block : "Lorwyn"
		},
		{
			name : "Duel Decks: Elves vs. Goblins",
			code : "EVG",
			releaseDate : "2007-11-16",
			border : "black",
			type : "duel deck"
		},
		{
			name : "Morningtide",
			code : "MOR",
			releaseDate : "2008-02-01",
			border : "black",
			type : "expansion",
			block : "Lorwyn"
		},
		{
			name : "Shadowmoor",
			code : "SHM",
			releaseDate : "2008-05-02",
			border : "black",
			type : "expansion",
			block : "Shadowmoor"
		},
		{
			name : "Eventide",
			code : "EVE",
			releaseDate : "2008-07-25",
			border : "black",
			type : "expansion",
			block : "Shadowmoor"
		},
		{
			name : "From the Vault: Dragons",
			code : "DRB",
			releaseDate : "2008-08-29",
			border : "black",
			type : "from the vault"
		},
		{
			name : "Shards of Alara",
			code : "ALA",
			releaseDate : "2008-10-03",
			border : "black",
			type : "expansion",
			block : "Alara"
		},
		{
			name : "Duel Decks: Jace vs. Chandra",
			code : "DD2",
			releaseDate : "2008-11-07",
			border : "black",
			type : "duel deck"
		},
		{
			name : "Conflux",
			code : "CON",
			releaseDate : "2009-02-06",
			border : "black",
			type : "expansion",
			block : "Alara"
		},
		{
			name : "Duel Decks: Divine vs. Demonic",
			code : "DDC",
			releaseDate : "2009-04-10",
			border : "black",
			type : "duel deck"
		},
		{
			name : "Alara Reborn",
			code : "ARB",
			releaseDate : "2009-04-30",
			border : "black",
			type : "expansion",
			block : "Alara"
		},
		{
			name : "Magic 2010",
			code : "M10",
			releaseDate : "2009-07-17",
			border : "black",
			type : "core"
		},
		{
			name : "From the Vault: Exiled",
			code : "V09",
			releaseDate : "2009-08-28",
			border : "black",
			type : "from the vault"
		},
		{
			name : "Planechase",
			code : "HOP",
			releaseDate : "2009-09-04",
			border : "black",
			type : "planechase"
		},
		{
			name : "Zendikar",
			code : "ZEN",
			releaseDate : "2009-10-02",
			border : "black",
			type : "expansion",
			block : "Zendikar"
		},
		{
			name : "Duel Decks: Garruk vs. Liliana",
			code : "DDD",
			releaseDate : "2009-10-30",
			border : "black",
			type : "duel deck"
		},
		{
			name : "Premium Deck Series: Slivers",
			code : "H09",
			releaseDate : "2009-11-20",
			border : "black",
			type : "premium deck"
		},
		{
			name : "Worldwake",
			code : "WWK",
			releaseDate : "2010-02-05",
			border : "black",
			type : "expansion",
			block : "Zendikar"
		},
		{
			name : "Duel Decks: Phyrexia vs. the Coalition",
			code : "DDE",
			releaseDate : "2010-03-19",
			border : "black",
			type : "duel deck"
		},
		{
			name : "Rise of the Eldrazi",
			code : "ROE",
			releaseDate : "2010-04-23",
			border : "black",
			type : "expansion",
			block : "Zendikar"
		},
		{
			name : "Archenemy",
			code : "ARC",
			releaseDate : "2010-06-18",
			border : "black",
			type : "archenemy"
		},
		{
			name : "Magic 2011",
			code : "M11",
			releaseDate : "2010-07-16",
			border : "black",
			type : "core"
		},
		{
			name : "From the Vault: Relics",
			code : "V10",
			releaseDate : "2010-08-27",
			border : "black",
			type : "from the vault"
		},
		{
			name : "Duel Decks: Elspeth vs. Tezzeret",
			code : "DDF",
			releaseDate : "2010-09-03",
			border : "black",
			type : "duel deck"
		},
		{
			name : "Scars of Mirrodin",
			code : "SOM",
			releaseDate : "2010-10-01",
			border : "black",
			type : "expansion",
			block : "Scars of Mirrodin"
		},
		{
			name : "Premium Deck Series: Fire & Lightning",
			code : "PD2",
			releaseDate : "2010-11-19",
			border : "black",
			type : "premium deck"
		},
		{
			name : "Mirrodin Besieged",
			code : "MBS",
			releaseDate : "2011-02-04",
			border : "black",
			type : "expansion",
			block : "Scars of Mirrodin"
		},
		{
			name : "Duel Decks: Knights vs. Dragons",
			code : "DDG",
			releaseDate : "2011-04-01",
			border : "black",
			type : "duel deck"
		},
		{
			name : "New Phyrexia",
			code : "NPH",
			releaseDate : "2011-05-13",
			border : "black",
			type : "expansion",
			block : "Scars of Mirrodin"
		},
		{
			name : "Commander",
			code : "CMD",
			releaseDate : "2011-06-17",
			border : "black",
			type : "commander"
		},
		{
			name : "Magic 2012",
			code : "M12",
			releaseDate : "2011-07-15",
			border : "black",
			type : "core"
		},
		{
			name : "From the Vault: Legends",
			code : "V11",
			releaseDate : "2011-08-26",
			border : "black",
			type : "from the vault"
		},
		{
			name : "Duel Decks: Ajani vs. Nicol Bolas",
			code : "DDH",
			releaseDate : "2011-09-02",
			border : "black",
			type : "duel deck"
		},
		{
			name : "Innistrad",
			code : "ISD",
			releaseDate : "2011-09-30",
			border : "black",
			type : "expansion",
			block : "Innistrad"
		},
		{
			name : "Premium Deck Series: Graveborn",
			code : "PD3",
			releaseDate : "2011-11-18",
			border : "black",
			type : "premium deck"
		},
		{
			name : "Dark Ascension",
			code : "DKA",
			releaseDate : "2012-02-03",
			border : "black",
			type : "expansion",
			block : "Innistrad"
		},
		{
			name : "Duel Decks: Venser vs. Koth",
			code : "DDI",
			releaseDate : "2012-03-30",
			border : "black",
			type : "duel deck"
		},
		{
			name : "Avacyn Restored",
			code : "AVR",
			releaseDate : "2012-05-04",
			border : "black",
			type : "expansion",
			block : "Innistrad"
		},
		{
			name : "Planechase 2012 Edition",
			code : "PC2",
			releaseDate : "2012-06-01",
			border : "black",
			type : "planechase"
		},
		{
			name : "Magic 2013",
			code : "M13",
			releaseDate : "2012-07-13",
			border : "black",
			type : "core"
		},
		{
			name : "From the Vault: Realms",
			code : "V12",
			releaseDate : "2012-08-31",
			border : "black",
			type : "from the vault"
		},
		{
			name : "Duel Decks: Izzet vs. Golgari",
			code : "DDJ",
			releaseDate : "2012-09-07",
			border : "black",
			type : "duel deck"
		},
		{
			name : "Return to Ravnica",
			code : "RTR",
			releaseDate : "2012-10-05",
			border : "black",
			type : "expansion",
			block : "Return to Ravnica"
		},
		{
			name : "Commander's Arsenal",
			code : "CMA",
			releaseDate : "2012-11-02",
			border : "black",
			type : "commander"
		},
		{
			name : "Gatecrash",
			code : "GTC",
			releaseDate : "2013-02-01",
			border : "black",
			type : "expansion",
			block : "Return to Ravnica"
		},
		{
			name : "Duel Decks: Sorin vs. Tibalt",
			code : "SVT",
			releaseDate : "2013-03-15",
			border : "black",
			type : "duel deck"
		},
		{
			name : "Dragon's Maze",
			code : "DGM",
			releaseDate : "2013-05-03",
			border : "black",
			type : "expansion",
			block : "Return to Ravnica"
		},
		{
			name : "Modern Masters",
			code : "MMA",
			releaseDate : "2013-06-07",
			border : "black",
			type : "reprint"
		},
		{
			name : "Magic 2014 Core Set",
			code : "M14",
			releaseDate : "2013-07-19",
			border : "black",
			type : "core"
		},
		{
			name : "From the Vault: Twenty",
			code : "V13",
			releaseDate : "2013-08-23",
			border : "black",
			type : "from the vault"
		}
	];
})(typeof exports==="undefined" ? window.C={} : exports);
