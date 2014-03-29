"use strict";

(function(exports)
{
	exports.SUPERTYPES = ["Basic", "Legendary", "Snow", "World", "Ongoing"];
	exports.TYPES = ["Instant", "Sorcery", "Artifact", "Creature", "Enchantment", "Land", "Planeswalker", "Tribal", "Plane", "Phenomenon", "Scheme", "Vanguard"];

	// Unglued/Unhinged types
	exports.TYPES.push("Enchant", "Player", "Summon", "Interrupt", "Scariest", "You'll", "Ever", "See", "Eaturecray");

	exports.SETS_NOT_ON_GATHERER = ["HHO", "ATH"];
	
	exports.SETS =
	[
		{
			name : "Limited Edition Alpha",
			code : "LEA",
			gathererCode : "1E",
			releaseDate : "1993-08-05",
			border : "black",
			type : "core",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common"]
		},
		{
			name : "Limited Edition Beta",
			code : "LEB",
			gathererCode : "2E",
			releaseDate : "1993-10-01",
			border : "black",
			type : "core",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common"]
		},
		{
			name : "Arabian Nights",
			code : "ARN",
			gathererCode : "AN",
			releaseDate : "1993-12-01",
			border : "black",
			type : "expansion",
			booster : ["uncommon", "uncommon", "common", "common", "common", "common", "common", "common"]
		},
		{
			name : "Unlimited Edition",
			code : "2ED",
			gathererCode : "2U",
			releaseDate : "1993-12-01",
			border : "white",
			type : "core",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common"]
		},
		{
			name : "Antiquities",
			code : "ATQ",
			gathererCode : "AQ",
			releaseDate : "1994-03-01",
			border : "black",
			type : "expansion",
			booster : ["uncommon", "uncommon", "common", "common", "common", "common", "common", "common"]			
		},
		{
			name : "Revised Edition",
			code : "3ED",
			gathererCode : "3E",
			releaseDate : "1994-04-01",
			border : "white",
			type : "core",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common"]
		},
		{
			name : "Legends",
			code : "LEG",
			gathererCode : "LE",
			releaseDate : "1994-06-01",
			border : "black",
			type : "expansion",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common"]
		},
		{
			name : "Promo set for Gatherer",
			code : "PPR",
			releaseDate : "1994-07-01",
			border : "black",
			type : "promo"
		},
		{
			name : "The Dark",
			code : "DRK",
			gathererCode : "DK",
			releaseDate : "1994-08-01",
			border : "black",
			type : "expansion",
			booster : ["uncommon", "uncommon", "common", "common", "common", "common", "common", "common"]
		},
		{
			name : "Fallen Empires",
			code : "FEM",
			gathererCode : "FE",
			releaseDate : "1994-11-01",
			border : "black",
			type : "expansion",
			booster : ["uncommon", "uncommon", "common", "common", "common", "common", "common", "common"]
		},
		{
			name : "Fourth Edition",
			code : "4ED",
			gathererCode : "4E",
			releaseDate : "1995-04-01",
			border : "white",
			type : "core",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common"]
		},
		{
			name : "Ice Age",
			code : "ICE",
			gathererCode : "IA",
			releaseDate : "1995-06-01",
			border : "black",
			type : "expansion",
			block : "Ice Age",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common"]
		},
		{
			name : "Chronicles",
			code : "CHR",
			gathererCode : "CH",
			releaseDate : "1995-07-01",
			border : "white",
			type : "reprint",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common"]
		},
		{
			name : "Homelands",
			code : "HML",
			gathererCode : "HM",
			releaseDate : "1995-10-01",
			border : "black",
			type : "expansion",
			booster : [["rare", "uncommon"], ["rare", "uncommon"], "common", "common", "common", "common", "common", "common"]
		},
		{
			name : "Alliances",
			code : "ALL",
			gathererCode : "AL",
			releaseDate : "1996-06-10",
			border : "black",
			type : "expansion",
			block : "Ice Age",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common"]
		},
		{
			name : "Mirage",
			code : "MIR",
			gathererCode : "MI",
			releaseDate : "1996-10-08",
			border : "black",
			type : "expansion",
			block : "Mirage",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common"]
		},
		{
			name : "Visions",
			code : "VIS",
			gathererCode : "VI",
			releaseDate : "1997-02-03",
			border : "black",
			type : "expansion",
			block : "Mirage",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common"]
		},
		{
			name : "Fifth Edition",
			code : "5ED",
			gathererCode : "5E",
			releaseDate : "1997-03-24",
			border : "white",
			type : "core",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common"]
		},
		{
			name : "Portal",
			code : "POR",
			gathererCode : "PO",
			releaseDate : "1997-05-01",
			border : "black",
			type : "starter",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common"]
		},
		{
			name : "Vanguard",
			code : "VAN",
			releaseDate : "1997-05-01",
			border : "black",
			type : "vanguard"
		},
		{
			name : "Weatherlight",
			code : "WTH",
			gathererCode : "WL",
			releaseDate : "1997-06-09",
			border : "black",
			type : "expansion",
			block : "Mirage",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common"]
		},
		{
			name : "Tempest",
			code : "TMP",
			gathererCode : "TE",
			releaseDate : "1997-10-14",
			border : "black",
			type : "expansion",
			block : "Tempest",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common"]
		},
		{
			name : "Stronghold",
			code : "STH",
			gathererCode : "ST",
			releaseDate : "1998-03-02",
			border : "black",
			type : "expansion",
			block : "Tempest",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common"]
		},
		{
			name : "Portal Second Age",
			code : "PO2",
			gathererCode : "P2",
			releaseDate : "1998-06-01",
			border : "black",
			type : "starter",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common"]
		},
		{
			name : "Exodus",
			code : "EXO",
			gathererCode : "EX",
			releaseDate : "1998-06-15",
			border : "black",
			type : "expansion",
			block : "Tempest",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common"]
		},
		{
			name : "Unglued",
			code : "UGL",
			gathererCode : "UG",
			releaseDate : "1998-08-11",
			border : "silver",
			type : "un",
			booster : ["rare", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "land"]
		},
		{
			name : "Urza's Saga",
			code : "USG",
			gathererCode : "UZ",
			releaseDate : "1998-10-12",
			border : "black",
			type : "expansion",
			block : "Urza's",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common"]
		},
		{
			name : "Anthologies",
			code : "ATH",
			releaseDate : "1998-11-01",
			border : "white",
			type : "box"
		},
		{
			name : "Urza's Legacy",
			code : "ULG",
			gathererCode : "GU",
			releaseDate : "1999-02-15",
			border : "black",
			type : "expansion",
			block : "Urza's",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common"]
		},
		{
			name : "Classic Sixth Edition",
			code : "6ED",
			gathererCode : "6E",
			releaseDate : "1999-04-21",
			border : "white",
			type : "core",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common"]
		},
		{
			name : "Portal Three Kingdoms",
			code : "PTK",
			gathererCode : "PK",
			releaseDate : "1999-05-01",
			border : "white",
			type : "starter",
			booster : ["rare", "uncommon", "uncommon", "common", "common", "common", "common", "common", "land", "land"]
		},
		{
			name : "Urza's Destiny",
			code : "UDS",
			gathererCode : "CG",
			releaseDate : "1999-06-07",
			border : "black",
			type : "expansion",
			block : "Urza's",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common"]
		},
		{
			name : "Starter 1999",
			code : "S99",
			gathererCode : "P3",
			releaseDate : "1999-07-01",
			border : "white",
			type : "starter",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "land", "land"]
		},
		{
			name : "Mercadian Masques",
			code : "MMQ",
			gathererCode : "MM",
			releaseDate : "1999-10-04",
			border : "black",
			type : "expansion",
			block : "Masques",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common"]
		},
		{
			name : "Battle Royale Box Set",
			code : "BRB",
			gathererCode : "BR",
			releaseDate : "1999-11-12",
			border : "white",
			type : "box"
		},
		{
			name : "Nemesis",
			code : "NMS",
			gathererCode : "NE",
			releaseDate : "2000-02-14",
			border : "black",
			type : "expansion",
			block : "Masques"		,
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common"]	
		},
		{
			name : "Starter 2000",
			code : "S00",
			gathererCode : "P4",
			releaseDate : "2000-04-01",
			border : "white",
			type : "starter"
		},
		{
			name : "Prophecy",
			code : "PCY",
			gathererCode : "PR",
			releaseDate : "2000-06-05",
			border : "black",
			type : "expansion",
			block : "Masques",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common"]
		},
		{
			name : "Beatdown Box Set",
			code : "BTD",
			gathererCode : "BD",
			releaseDate : "2000-10-01",
			border : "white",
			type : "box"
		},
		{
			name : "Invasion",
			code : "INV",
			gathererCode : "IN",
			releaseDate : "2000-10-02",
			border : "black",
			type : "expansion",
			block : "Invasion",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common"]
		},
		{
			name : "Planeshift",
			code : "PLS",
			gathererCode : "PS",
			releaseDate : "2001-02-05",
			border : "black",
			type : "expansion",
			block : "Invasion",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common"]
		},
		{
			name : "Seventh Edition",
			code : "7ED",
			gathererCode : "7E",
			releaseDate : "2001-04-11",
			border : "white",
			type : "core",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "land"]
		},
		{
			name : "Apocalypse",
			code : "APC",
			gathererCode : "AP",
			releaseDate : "2001-06-04",
			border : "black",
			type : "expansion",
			block : "Invasion",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common"]
		},
		{
			name : "Odyssey",
			code : "ODY",
			gathererCode : "OD",
			releaseDate : "2001-10-01",
			border : "black",
			type : "expansion",
			block : "Odyssey",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common"]
		},
		{
			name : "Torment",
			code : "TOR",
			releaseDate : "2002-02-04",
			border : "black",
			type : "expansion",
			block : "Odyssey",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common"]
		},
		{
			name : "Judgment",
			code : "JUD",
			releaseDate : "2002-05-27",
			border : "black",
			type : "expansion",
			block : "Odyssey",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common"]
		},
		{
			name : "Onslaught",
			code : "ONS",
			releaseDate : "2002-10-07",
			border : "black",
			type : "expansion",
			block : "Onslaught",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common"]
		},
		{
			name : "Legions",
			code : "LGN",
			releaseDate : "2003-02-03",
			border : "black",
			type : "expansion",
			block : "Onslaught",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common"]
		},
		{
			name : "Scourge",
			code : "SCG",
			releaseDate : "2003-05-26",
			border : "black",
			type : "expansion",
			block : "Onslaught",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common"]
		},
		{
			name : "Eighth Edition",
			code : "8ED",
			releaseDate : "2003-07-28",
			border : "white",
			type : "core",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "land"]
		},
		{
			name : "Mirrodin",
			code : "MRD",
			releaseDate : "2003-10-02",
			border : "black",
			type : "expansion",
			block : "Mirrodin",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common"]
		},
		{
			name : "Darksteel",
			code : "DST",
			releaseDate : "2004-02-06",
			border : "black",
			type : "expansion",
			block : "Mirrodin",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common"]
		},
		{
			name : "Fifth Dawn",
			code : "5DN",
			releaseDate : "2004-06-04",
			border : "black",
			type : "expansion",
			block : "Mirrodin",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common"]
		},
		{
			name : "Champions of Kamigawa",
			code : "CHK",
			releaseDate : "2004-10-01",
			border : "black",
			type : "expansion",
			block : "Kamigawa",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common"]
		},
		{
			name : "Unhinged",
			code : "UNH",
			releaseDate : "2004-11-20",
			border : "silver",
			type : "un",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "land"]
		},
		{
			name : "Betrayers of Kamigawa",
			code : "BOK",
			releaseDate : "2005-02-04",
			border : "black",
			type : "expansion",
			block : "Kamigawa",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common"]
		},
		{
			name : "Saviors of Kamigawa",
			code : "SOK",
			releaseDate : "2005-06-03",
			border : "black",
			type : "expansion",
			block : "Kamigawa",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common"]
		},
		{
			name : "Ninth Edition",
			code : "9ED",
			releaseDate : "2005-07-29",
			border : "white",
			type : "core",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "land"]
		},
		{
			name : "Ravnica: City of Guilds",
			code : "RAV",
			releaseDate : "2005-10-07",
			border : "black",
			type : "expansion",
			block : "Ravnica",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common"]
		},
		{
			name : "Guildpact",
			code : "GPT",
			releaseDate : "2006-02-03",
			border : "black",
			type : "expansion",
			block : "Ravnica",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common"]
		},
		{
			name : "Dissension",
			code : "DIS",
			releaseDate : "2006-05-05",
			border : "black",
			type : "expansion",
			block : "Ravnica",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common"]
		},
		{
			name : "Coldsnap",
			code : "CSP",
			releaseDate : "2006-07-21",
			border : "black",
			type : "expansion",
			block : "Ice Age",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common"]
		},
		{
			name : "Time Spiral",
			code : "TSP",
			releaseDate : "2006-10-06",
			border : "black",
			type : "expansion",
			block : "Time Spiral",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "timeshifted purple"]
		},
		{
			name : 'Time Spiral "Timeshifted"',
			code : "TSB",
			releaseDate : "2006-10-06",
			border : "black",
			type : "expansion",
			block : "Time Spiral"
		},
		{
			name : "Happy Holidays",
			code : "HHO",
			releaseDate : "2006-12-25",
			border : "silver",
			type : "promo",
		},
		{
			name : "Planar Chaos",
			code : "PLC",
			releaseDate : "2007-02-02",
			border : "black",
			type : "expansion",
			block : "Time Spiral",
			booster : ["rare", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "timeshifted common", "timeshifted common", "timeshifted common", ["timeshifted rare", "timeshifted uncommon"]]
		},
		{
			name : "Future Sight",
			code : "FUT",
			releaseDate : "2007-05-04",
			border : "black",
			type : "expansion",
			block : "Time Spiral",
			booster : [["rare", "timeshifted rare"], ["uncommon", "timeshifted uncommon"], ["uncommon", "timeshifted uncommon"], ["uncommon", "timeshifted uncommon"], ["common", "timeshifted common"], ["common", "timeshifted common"], ["common", "timeshifted common"], ["common", "timeshifted common"], ["common", "timeshifted common"], ["common", "timeshifted common"], ["common", "timeshifted common"], ["common", "timeshifted common"], ["common", "timeshifted common"], ["common", "timeshifted common"], ["common", "timeshifted common"]]
		},
		{
			name : "Tenth Edition",
			code : "10E",
			releaseDate : "2007-07-13",
			border : "black",
			type : "core",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "land", "marketing"]
		},
		{
			name : "Masters Edition",
			code : "MED",
			releaseDate : "2007-09-10",
			border : "black",
			type : "masters"
		},
		{
			name : "Lorwyn",
			code : "LRW",
			releaseDate : "2007-10-12",
			border : "black",
			type : "expansion",
			block : "Lorwyn",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "marketing"]
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
			block : "Lorwyn",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "marketing"]
		},
		{
			name : "Shadowmoor",
			code : "SHM",
			releaseDate : "2008-05-02",
			border : "black",
			type : "expansion",
			block : "Shadowmoor",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "marketing"]
		},
		{
			name : "Eventide",
			code : "EVE",
			releaseDate : "2008-07-25",
			border : "black",
			type : "expansion",
			block : "Shadowmoor",
			booster : ["rare", "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "marketing"]
		},
		{
			name : "From the Vault: Dragons",
			code : "DRB",
			releaseDate : "2008-08-29",
			border : "black",
			type : "from the vault"
		},
		{
			name : "Masters Edition II",
			code : "ME2",
			releaseDate : "2008-09-22",
			border : "black",
			type : "masters"
		},
		{
			name : "Shards of Alara",
			code : "ALA",
			releaseDate : "2008-10-03",
			border : "black",
			type : "expansion",
			block : "Alara",
			booster : [["rare", "mythic rare"], "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "land", "marketing"]
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
			block : "Alara",
			booster : [["rare", "mythic rare"], "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "land", "marketing"]
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
			block : "Alara",
			booster : [["rare", "mythic rare"], "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "land", "marketing"]
		},
		{
			name : "Magic 2010",
			code : "M10",
			releaseDate : "2009-07-17",
			border : "black",
			type : "core",
			booster : [["rare", "mythic rare"], "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "land", "marketing"]
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
			name : "Masters Edition III",
			code : "ME3",
			releaseDate : "2009-09-07",
			border : "black",
			type : "masters"
		},		
		{
			name : "Zendikar",
			code : "ZEN",
			releaseDate : "2009-10-02",
			border : "black",
			type : "expansion",
			block : "Zendikar",
			booster : [["rare", "mythic rare"], "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "land", "marketing"]
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
			block : "Zendikar",
			booster : [["rare", "mythic rare"], "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "land", "marketing"]
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
			block : "Zendikar",
			booster : [["rare", "mythic rare"], "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "land", "marketing"]
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
			type : "core",
			booster : [["rare", "mythic rare"], "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "land", "marketing"]
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
			block : "Scars of Mirrodin",
			booster : [["rare", "mythic rare"], "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "land", "marketing"]
		},
		{
			name : "Premium Deck Series: Fire and Lightning",
			code : "PD2",
			releaseDate : "2010-11-19",
			border : "black",
			type : "premium deck"
		},
		{
			name : "Masters Edition IV",
			code : "ME4",
			releaseDate : "2011-01-10",
			border : "black",
			type : "masters"
		},
		{
			name : "Mirrodin Besieged",
			code : "MBS",
			releaseDate : "2011-02-04",
			border : "black",
			type : "expansion",
			block : "Scars of Mirrodin",
			booster : [["rare", "mythic rare"], "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "land", "marketing"]
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
			block : "Scars of Mirrodin",
			booster : [["rare", "mythic rare"], "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "land", "marketing"]
		},
		{
			name : "Magic: The Gathering-Commander",
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
			type : "core",
			booster : [["rare", "mythic rare"], "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "land", "marketing"]
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
			block : "Innistrad",
			booster : [["rare", "mythic rare"], "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", ["land", "checklist"], "marketing", "double faced"]
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
			block : "Innistrad",
			booster : [["rare", "mythic rare"], "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "land", "marketing"]
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
			block : "Innistrad",
			booster : [["rare", "mythic rare"], "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "land", "marketing"]
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
			type : "core",
			booster : [["rare", "mythic rare"], "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "land", "marketing"]
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
			block : "Return to Ravnica",
			booster : [["rare", "mythic rare"], "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "land", "marketing"]
		},
		{
			name : "Commander's Arsenal",
			code : "CMA",
			gathererCode : "CM1",
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
			block : "Return to Ravnica",
			booster : [["rare", "mythic rare"], "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "land", "marketing"]
		},
		{
			name : "Duel Decks: Sorin vs. Tibalt",
			code : "DDK",
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
			block : "Return to Ravnica",
			booster : [["rare", "mythic rare"], "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "land", "marketing"]
		},
		{
			name : "Modern Masters",
			code : "MMA",
			releaseDate : "2013-06-07",
			border : "black",
			type : "reprint",
			booster : [["rare", "mythic rare"], "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", ["foil mythic rare", "foil rare", "foil uncommon", "foil common"]]
		},
		{
			name : "Magic 2014 Core Set",
			code : "M14",
			releaseDate : "2013-07-19",
			border : "black",
			type : "core",
			booster : [["rare", "mythic rare"], "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "land", "marketing"]
		},
		{
			name : "From the Vault: Twenty",
			code : "V13",
			releaseDate : "2013-08-23",
			border : "black",
			type : "from the vault"
		},
		{
			name : "Duel Decks: Heroes vs. Monsters",
			code : "DDL",
			releaseDate : "2013-09-06",
			border : "black",
			type : "duel deck"
		},
		{
			name : "Theros",
			code : "THS",
			releaseDate : "2013-09-27",
			border : "black",
			type : "expansion",
			block : "Theros",
			booster : [["rare", "mythic rare"], "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "land", "marketing"]
		},
		{
			name : "Commander 2013 Edition",
			code : "C13",
			releaseDate : "2013-11-01",
			border : "black",
			type : "commander"
		},
		{
			name : "Born of the Gods",
			code : "BNG",
			releaseDate : "2014-02-07",
			border : "black",
			type : "expansion",
			block : "Theros",
			booster : [["rare", "mythic rare"], "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "land", "marketing"]
		},
		{
			name : "Duel Decks: Jace vs. Vraska",
			code : "DDM",
			releaseDate : "2014-03-14",
			border : "black",
			type : "duel deck"
		}
	];

	exports.OLD_SET_CODE_MAP =
	{
		"9E" : "9ED",
		"8E" : "8ED",
		"D2" : "DD2",
		"COM" : "CMD",
		"P02" : "PO2",
		"NEM" : "NMS",
		"PCH" : "HOP",
		"FVR" : "V12",
		"FVL" : "V11",
		"FVE" : "V09",
		"CFX" : "CON"
	};

	exports.EXTRA_SET_CARD_PRINTINGS =
	{
		"Anthologies" : [ "Aesthir Glider", "Armageddon", "Armored Pegasus", "Benalish Knight", "Black Knight", "Brushland", "Canopy Spider", "Carnivorous Plant", "Combat Medic", "Cuombajj Witches", "Disenchant", "Drifting Meadow", "Erhnam Djinn", "Feast of the Unicorn", "Fireball", "Forest", "Freewind Falcon", "Giant Growth", "Giant Spider", "Goblin Balloon Brigade", "Goblin Digging Team", "Goblin Grenade", "Goblin Hero", "Goblin King", "Goblin Matron", "Goblin Mutant", "Goblin Offensive", "Goblin Recruiter", "Goblin Snowman", "Goblin Tinkerer", "Goblin Vandal", "Goblin Warrens", "Gorilla Chieftain", "Hurricane", "Hymn to Tourach", "Hypnotic Specter", "Icatian Javelineers", "Ihsan's Shade", "Infantry Veteran", "Jalum Tome", "Knight of Stromgald", "Lady Orca", "Lightning Bolt", "Llanowar Elves", "Mirri, Cat Warrior", "Mogg Fanatic", "Mogg Flunkies", "Mogg Raider", "Mountain", "Nevinyrral's Disk", "Order of the White Shield", "Overrun", "Pacifism", "Pegasus Charger", "Pegasus Stampede", "Pendelhaven", "Plains", "Polluted Mire", "Pyrokinesis", "Pyrotechnics", "Raging Goblin", "Ranger en-Vec", "Samite Healer", "Scavenger Folk", "Serra Angel", "Serrated Arrows", "Slippery Karst", "Smoldering Crater", "Spectral Bears", "Strip Mine", "Swamp", "Swords to Plowshares", "Terror", "Unholy Strength", "Uthden Troll", "Volcanic Dragon", "Warrior's Honor", "White Knight", "Woolly Spider", "Youthful Knight" ]
	};
})(typeof exports==="undefined" ? window.C={} : exports);
