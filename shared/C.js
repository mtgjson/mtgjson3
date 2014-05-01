"use strict";

(function(exports)
{
	exports.SUPERTYPES = ["Basic", "Legendary", "Snow", "World", "Ongoing"];
	exports.TYPES = ["Instant", "Sorcery", "Artifact", "Creature", "Enchantment", "Land", "Planeswalker", "Tribal", "Plane", "Phenomenon", "Scheme", "Vanguard"];

	// Unglued/Unhinged types
	exports.TYPES.push("Enchant", "Player", "Summon", "Interrupt", "Scariest", "You'll", "Ever", "See", "Eaturecray");

	exports.SETS_NOT_ON_GATHERER = ["HHO", "ATH", "ITP", "DKM", "RQS", "DPA"];
	exports.SETS_WITH_NO_IMAGES = [];
	
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
			name : "Rivals Quick Start Set",
			code : "RQS",
			releaseDate : "1996-07-01",
			border : "white",
			type : "box"
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
			name : "Introductory Two-Player Set",
			code : "ITP",
			releaseDate : "1996-12-31",
			border : "white",
			type : "starter"
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
			name : "Deckmasters",
			code : "DKM",
			releaseDate : "2001-12-01",
			border : "white",
			type : "box"
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
			name : "Duels of the Planeswalkers",
			code : "DPA",
			releaseDate : "2010-06-04",
			border : "black",
			type : "box"
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
		},
		{
			name : "Journey into Nyx",
			code : "JOU",
			releaseDate : "2014-05-02",
			border : "black",
			type : "expansion",
			block : "Theros",
			booster : [["rare", "mythic rare"], "uncommon", "uncommon", "uncommon", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "land", "marketing"]
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
		"Anthologies" : [ "Aesthir Glider", "Armageddon", "Armored Pegasus", "Benalish Knight", "Black Knight", "Brushland", "Canopy Spider", "Carnivorous Plant", "Combat Medic", "Cuombajj Witches", "Disenchant", "Drifting Meadow", "Erhnam Djinn", "Feast of the Unicorn", "Fireball", "Forest", "Freewind Falcon", "Giant Growth", "Giant Spider", "Goblin Balloon Brigade", "Goblin Digging Team", "Goblin Grenade", "Goblin Hero", "Goblin King", "Goblin Matron", "Goblin Mutant", "Goblin Offensive", "Goblin Recruiter", "Goblin Snowman", "Goblin Tinkerer", "Goblin Vandal", "Goblin Warrens", "Gorilla Chieftain", "Hurricane", "Hymn to Tourach", "Hypnotic Specter", "Icatian Javelineers", "Ihsan's Shade", "Infantry Veteran", "Jalum Tome", "Knight of Stromgald", "Lady Orca", "Lightning Bolt", "Llanowar Elves", "Mirri, Cat Warrior", "Mogg Fanatic", "Mogg Flunkies", "Mogg Raider", "Mountain", "Nevinyrral's Disk", "Order of the White Shield", "Overrun", "Pacifism", "Pegasus Charger", "Pegasus Stampede", "Pendelhaven", "Plains", "Polluted Mire", "Pyrokinesis", "Pyrotechnics", "Raging Goblin", "Ranger en-Vec", "Samite Healer", "Scavenger Folk", "Serra Angel", "Serrated Arrows", "Slippery Karst", "Smoldering Crater", "Spectral Bears", "Strip Mine", "Swamp", "Swords to Plowshares", "Terror", "Unholy Strength", "Uthden Troll", "Volcanic Dragon", "Warrior's Honor", "White Knight", "Woolly Spider", "Youthful Knight" ],
		"Introductory Two-Player Set" : [ "Alabaster Potion", "Battering Ram", "Bog Imp", "Bog Wraith", "Circle of Protection: Black", "Circle of Protection: Red", "Clockwork Beast", "Cursed Land", "Dark Ritual", "Detonate", "Disintegrate", "Durkwood Boars", "Elven Riders", "Elvish Archers", "Energy Flux", "Feedback", "Fireball", "Forest", "Glasses of Urza", "Grizzly Bears", "Healing Salve", "Hill Giant", "Ironclaw Orcs", "Island", "Jayemdae Tome", "Lost Soul", "Merfolk of the Pearl Trident", "Mesa Pegasus", "Mons's Goblin Raiders", "Mountain", "Murk Dwellers", "Orcish Artillery", "Orcish Oriflamme", "Pearled Unicorn", "Phantom Monster", "Plains", "Power Sink", "Pyrotechnics", "Raise Dead", "Reverse Damage", "Rod of Ruin", "Scathe Zombies", "Sorceress Queen", "Swamp", "Terror", "Twiddle", "Unsummon", "Untamed Wilds", "Vampire Bats", "Wall of Bone", "War Mammoth", "Warp Artifact", "Weakness", "Whirling Dervish", "Winter Blast", "Zephyr Falcon", "Scryb Sprites" ],
		"Deckmasters" : ["Abyssal Specter", "Balduvian Bears", "Balduvian Horde", "Barbed Sextant", "Bounty of the Hunt", "Contagion", "Dark Banishing", "Dark Ritual", "Death Spark", "Elkin Bottle", "Elvish Bard", "Folk of the Pines", "Forest", "Foul Familiar", "Fyndhorn Elves", "Giant Growth", "Giant Trap Door Spider", "Goblin Mutant", "Guerrilla Tactics", "Hurricane", "Icy Manipulator", "Incinerate", "Jokulhaups", "Karplusan Forest", "Lava Burst", "Lhurgoyf", "Lim-Dul's High Guard", "Mountain", "Necropotence", "Orcish Cannoneers", "Phantasmal Fiend", "Phyrexian War Beast", "Pillage", "Pyroclasm", "Shatter", "Soul Burn", "Storm Shaman", "Sulfurous Springs", "Swamp", "Underground River", "Walking Wall", "Woolly Spider", "Yavimaya Ancients", "Yavimaya Ants"],
		"Rivals Quick Start Set" : ["Alabaster Potion", "Battering Ram", "Bog Imp", "Bog Wraith", "Circle of Protection: Black", "Circle of Protection: Red", "Clockwork Beast", "Cursed Land", "Dark Ritual", "Detonate", "Disintegrate", "Durkwood Boars", "Elven Riders", "Elvish Archers", "Energy Flux", "Feedback", "Fireball", "Forest", "Glasses of Urza", "Grizzly Bears", "Healing Salve", "Hill Giant", "Ironclaw Orcs", "Island", "Jayemdae Tome", "Lost Soul", "Merfolk of the Pearl Trident", "Mesa Pegasus", "Mons's Goblin Raiders", "Mountain", "Murk Dwellers", "Orcish Artillery", "Orcish Oriflamme", "Pearled Unicorn", "Plains", "Power Sink", "Pyrotechnics", "Raise Dead", "Reverse Damge", "Rod of Ruin", "Scath Zombies", "Scryb Sprites", "Sorceress Queen", "Swamp", "Terror", "Twiddle", "Unsummon", "Untamed Wilds", "Vampire Bats", "Wall of Bone", "War Mammoth", "Warp Artifact", "Weakness", "Whirling Dervish", "Winter Blast", "Zephyr Falcon"],
		"Duels of the Planeswalkers" : ["Abyssal Specter", "Act of Treason", "Air Elemental", "Ascendant Evincar", "Banefire", "Blanchwood Armor", "Blaze", "Bloodmark Mentor", "Boomerang", "Cancel", "Cinder Pyromancer", "Civic Wayfinder", "Cloud Sprite", "Coat of Arms", "Consume Spirit", "Counterbore", "Crowd of Cinders", "Deluge", "Demon's Horn", "Denizen of the Deep", "Dragon's Claw", "Drove of Elves", "Drudge Skeletons", "Dusk Imp", "Duskdale Wurm", "Earth Elemental", "Elven Riders", "Elvish Champion", "Elvish Eulogist", "Elvish Promenade", "Elvish Visionary", "Elvish Warrior", "Enrage", "Essence Drain", "Essence Scatter", "Evacuation", "Eyeblight's Ending", "Forest", "Furnace of Rath", "Gaea's Herald", "Giant Growth", "Giant Spider", "Goblin Piker", "Goblin Sky Raider", "Greenweaver Druid", "Hill Giant", "Howl of the Night Pack", "Immaculate Magistrate", "Imperious Perfect", "Incinerate", "Island", "Jagged-Scar Archers", "Kamahl, Pit Fighter", "Kraken's Eye", "Lightning Elemental", "Loxodon Warhammer", "Lys Alana Huntmaster", "Mahamoti Djinn", "Megrim", "Mind Control", "Mind Rot", "Mind Shatter", "Mind Spring", "Molimo, Maro-Sorcerer", "Moonglove Winnower", "Mortivore", "Mountain", "Natural Spring", "Naturalize", "Nature's Spiral", "Negate", "Overrun", "Phantom Warrior", "Prodigal Pyromancer", "Rage Reflection", "Rampant Growth", "Ravenous Rats", "River Boa", "Roughshod Mentor", "Runeclaw Bear", "Sengir Vampire", "Severed Legion", "Shivan Dragon", "Shock", "Snapping Drake", "Spined Wurm", "Swamp", "Talara's Battalion", "Terror", "The Rack", "Thieving Magpie", "Trained Armodon", "Troll Ascetic", "Underworld Dreams", "Unholy Strength", "Unsummon", "Verdant Force", "Vigor", "Wall of Spears", "Wall of Wood", "Wurm's Tooth"]
	};

	exports.SET_CORRECTIONS =
	{
		ARN :
		[
			{ match : {name: "Bazaar of Baghdad"}, replace : {artist : "Jeff A. Menges"} },
			{ match : {name: "Library of Alexandria"}, replace : {artist : "Mark Poole"} }
		],
		LEG :
		[
			{ match : {name : "Pyrotechnics" }, replace : {flavor : "\"Hi! ni! ya! Behold the man of flint, that's me! / Four lightnings zigzag from me, strike and return.\"\n\n—Navajo war chant"}},
			{ match : {name: "The Tabernacle at Pendrell Vale"}, replace : {artist : "Nicola Leonard"} }
		],
		FEM :
		[
			{ renumberImages : "Armor Thrull", order : [1841, 1840, 1838, 1839] },
			{ renumberImages : "Basal Thrull", order : [1842, 1844, 1843, 1845] },
			{ renumberImages : "Brassclaw Orcs", order : [1966, 1938, 1937, 1940] },
			{ renumberImages : "Combat Medic", order : [1971, 1972, 1970, 1973] },
			{ renumberImages : "Elven Fortress", order : [1905, 1904, 1906, 1907] },
			{ renumberImages : "Elvish Hunter", order : [1910, 1911, 1909] },
			{ renumberImages : "Elvish Scout", order : [1913, 1912, 1914] },
			{ renumberImages : "Goblin Chirurgeon", order : [1948, 1949, 1947] },
			{ renumberImages : "Goblin War Drums", order : [1955, 1957, 1956, 1958] },
			{ renumberImages : "High Tide", order : [1873, 1872, 1874] },
			{ renumberImages : "Homarid Warrior", order : [1882, 1881, 1883] },
			{ renumberImages : "Homarid", order : [1875, 1876, 1877, 1878] },
			{ renumberImages : "Hymn to Tourach", order : [1850, 1849, 1851, 1852] },
			{ renumberImages : "Icatian Infantry", order : [1981, 1982, 1983, 1984] },
			{ renumberImages : "Icatian Moneychanger", order : [1989, 1990, 1991] },
			{ renumberImages : "Icatian Scout", order : [1994, 1997, 1996, 1995] },
			{ renumberImages : "Initiates of the Ebon Hand", order : [1855, 1854, 1853] },
			{ renumberImages : "Merseine", order : [1884, 1885, 1887, 1886] },
			{ renumberImages : "Mindstab Thrull", order : [1857, 1856, 1858] },
			{ renumberImages : "Necrite", order : [1860, 1859, 1861] },
			{ renumberImages : "Night Soil", order : [1918, 1917, 1919] },
			{ renumberImages : "Orcish Spy", order : [1962, 1961, 1963] },
			{ renumberImages : "Orcish Veteran", order : [1967, 1965, 1939, 1964] },
			{ renumberImages : "Order of Leitbur", order : [2001, 2000, 2002] },
			{ renumberImages : "Order of the Ebon Hand", order : [1863, 1862, 1864] },
			{ renumberImages : "Spore Cloud", order : [1920, 1922, 1921] },
			{ renumberImages : "Thallid", order : [1924, 1926, 1927, 1925] },
			{ renumberImages : "Thorn Thallid", order : [1933, 1934, 1935, 1936] },
			{ renumberImages : "Tidal Flats", order : [1891, 1892, 1893] },
			{ renumberImages : "Vodalian Mage", order : [1896, 1898, 1897] },
			{ renumberImages : "Vodalian Soldiers", order : [1899, 1901, 1900, 1902] }
		],
		"4ED" :
		[
			{ match : {name : "Pyrotechnics" }, replace : {flavor : "\"Hi! ni! ya! Behold the man of flint, that's me!\n\nFour lightnings zigzag from me, strike and return.\" —Navajo war chant"}},
			{ renumberImages : "Forest", order : [2377, 2378, 2379] },
			{ renumberImages : "Island", order : [2390, 2389, 2391] },
			{ renumberImages : "Mountain", order : [2383, 2381, 2382] },
			{ renumberImages : "Plains", order : [2386, 2385, 2384] },
			{ renumberImages : "Swamp", order : [2375, 2376, 2374] }
		],
		ICE :
		[
			{ renumberImages : "Forest", order : [2748, 2746, 2747] },
			{ renumberImages : "Island", order : [2768, 2767, 2769] },
			{ renumberImages : "Mountain", order : [2763, 2765, 2764] },
			{ renumberImages : "Plains", order : [2773, 2771, 2772] },
			{ renumberImages : "Swamp", order : [2744, 2743, 2745] }
		],
		HML :
		[
			{ renumberImages : "Abbey Matron", order : [3011, 3012] },
			{ renumberImages : "Ambush Party", order : [2989, 2988] },
			{ renumberImages : "Anaba Bodyguard", order : [2992, 2993] },
			{ renumberImages : "Anaba Shaman", order : [2995, 2994] },
			{ renumberImages : "Carapace", order : [2963, 2964] },
			{ renumberImages : "Dark Maze", order : [2940, 2939] },
			{ renumberImages : "Dwarven Trader", order : [3000, 3001] },
			{ renumberImages : "Folk of An-Havva", order : [2968, 2967] },
			{ renumberImages : "Hungry Mist", order : [2969, 2970] },
			{ renumberImages : "Mesa Falcon", order : [3022, 3021] },
			{ renumberImages : "Reef Pirates", order : [2955, 2954] },
			{ renumberImages : "Sengir Bats", order : [2930, 2929] },
			{ renumberImages : "Willow Faerie", order : [2982, 2983] }
		],
		ALL :
		[
			{ renumberImages : "Astrolabe", order : [3044, 3043] },
			{ renumberImages : "Balduvian War-Makers", order : [3162, 3163] },
			{ renumberImages : "Benthic Explorers", order : [3102, 3101] },
			{ renumberImages : "Deadly Insect", order : [3129, 3130] },
			{ renumberImages : "Enslaved Scout", order : [3169, 3170] },
			{ renumberImages : "Errand of Duty", order : [3193, 3192] },
			{ renumberImages : "False Demise", order : [3106, 3105] },
			{ renumberImages : "Foresight", order : [3108, 3109] },
			{ renumberImages : "Gift of the Woods", order : [3138, 3139] },
			{ renumberImages : "Gorilla Berserkers", order : [3140, 3141] },
			{ renumberImages : "Gorilla Chieftain", order : [3143, 3142] },
			{ renumberImages : "Gorilla War Cry", order : [3173, 3174] },
			{ renumberImages : "Kjeldoran Pride", order : [3201, 3202] },
			{ renumberImages : "Lim-Dûl's High Guard", order : [3083, 3082] },
			{ renumberImages : "Phyrexian War Beast", order : [3053, 3054] },
			{ renumberImages : "Royal Herbalist", order : [3213, 3212] },
			{ renumberImages : "Soldevi Sage", order : [3117, 3116] },
			{ renumberImages : "Soldevi Steam Beast", order : [3061, 3062] },
			{ renumberImages : "Taste of Paradise", order : [3150, 3149] },
			{ renumberImages : "Varchild's Crusader", order : [3186, 3185] },
			{ renumberImages : "Viscerid Armor", order : [3126, 3125] },
			{ renumberImages : "Whip Vine", order : [3154, 3155] },
			{ renumberImages : "Wild Aesthir", order : [3220, 3219] }
		],	
		MIR :
		[
			{ renumberImages : "Forest", order : [3569, 3567, 3568, 3566] },
			{ renumberImages : "Island", order : [3584, 3582, 3583, 3581] },
			{ renumberImages : "Mountain", order : [3580, 3578, 3579, 3577] },
			{ renumberImages : "Plains", order : [3585, 3587, 3586, 3588] },
			{ renumberImages : "Swamp", order : [3562, 3563, 3564, 3565] }
		],
		"5ED" :
		[
			{ match : {name : "Pyrotechnics" }, replace : {flavor : "\"Hi! ni! ya! Behold the man of flint, that's me! / Four lightnings zigzag from me, strike and return.\"\n\n—Navajo war chant"}},
			{ renumberImages : "Forest", order : [4171, 4172, 4173, 4174] },
			{ renumberImages : "Island", order : [4199, 4200, 4201, 4202] },
			{ renumberImages : "Mountain", order : [4195, 4196, 4197, 4198] },
			{ renumberImages : "Plains", order : [4204, 4206, 4205, 4203] },
			{ renumberImages : "Swamp", order : [4169, 4168, 4167, 4170] }
		],
		"6ED" :
		[
			{ match : {name : "Pyrotechnics" }, replace : {flavor : "\"Hi!ni!ya! Behold the man of flint, that's me! / Four lightnings zigzag from me, strike and return.\"\n\n—Navajo war chant"}}
		],
		TMP :
		[
			{ renumberImages : "Plains", order : [4953, 4954, 4955, 4956] }
		],
		BRB :
		[
			{ renumberImages : "Forest", order : [21119, 22347, 22351, 22349, 22348, 22352, 22355, 22353, 22354] },
			{ renumberImages : "Island", order : [21144, 22364, 22366, 22367, 22365] },
			{ renumberImages : "Mountain", order : [22344, 22335, 22336, 22339, 22342, 22334, 22343, 21118, 22340] },
			{ renumberImages : "Plains", order : [22357, 22356, 21145, 22362, 22361, 22363, 22360, 22358, 22359] },
			{ renumberImages : "Swamp", order : [21171, 22370, 22369, 22368] },
			{ match : {multiverseid : 22339}, replace : {artist : "Rob Alexander"} }
		],
		BTD :
		[
			{ renumberImages : "Forest", order : [27242, 27243, 27244] },
			{ renumberImages : "Island", order : [27236, 27237, 27238] },
			{ renumberImages : "Mountain", order : [27239, 27240, 27241] },
			{ renumberImages : "Swamp", order : [27233, 27234, 27235] }
		],
		PLS :
		[
			{ renumberImages : "Ertai, the Corrupted", order : [25614, 29292] },
			{ renumberImages : "Skyship Weatherlight", order : [26480, 29293] }
		],
		TOR :
		[
			{ match : {name: "Cabal Coffers"}, replace : {artist : "Don Hazeltine"} }
		],
		CHK :
		[
			{ renumberImages : "Brothers Yamazaki", order : [78968, 85106] },
			{ match : {multiverseid: 78968}, replace : {number : "160a"} },
			{ match : {multiverseid: 85106}, replace : {number : "160b"} }
		],
		BOK :
		[
			{ match : {name: "Budoka Pupil"}, replace :
				{
					number : "122a", layout : "flip", names : ["Budoka Pupil", "Ichiga, Who Topples Oaks"]
				}
			},
			{ match : {name: "Callow Jushi"}, replace :
				{
					number : "31a",
					layout : "flip",
					names : ["Callow Jushi", "Jaraku the Interloper"],
					text : "Whenever you cast a Spirit or Arcane spell, you may put a ki counter on Callow Jushi.\n\nAt the beginning of the end step, if there are two or more ki counters on Callow Jushi, you may flip it."
				}
			},
			{ copyCard : "Callow Jushi", replace :
				{
					name       : "Jaraku the Interloper",
					number     : "31b",
					text       : "Remove a ki counter from Jaraku the Interloper: Counter target spell unless its controller pays {2}.",
					type       : "Legendary Creature — Spirit",
					supertypes : ["Legendary"],
					types      : ["Creature"],
					subtypes   : ["Spirit"],
					power      : "3",
					toughness  : "4",
					imageName  : "jaraku the interloper"
				}
			},
			{ match : {name: "Cunning Bandit"}, replace :
				{
					number : "99a",
					layout : "flip",
					names : ["Cunning Bandit", "Azamuki, Treachery Incarnate"]
				}
			},
			{ match : {name: "Hired Muscle"}, replace :
				{
					number : "69a",
					layout : "flip",
					names : ["Hired Muscle", "Scarmaker"],
					text : "Whenever you cast a Spirit or Arcane spell, you may put a ki counter on Hired Muscle.\n\nAt the beginning of the end step, if there are two or more ki counters on Hired Muscle, you may flip it."
				}
			},
			{ copyCard : "Hired Muscle", replace :
				{
					name       : "Scarmaker",
					number     : "69b",
					text       : "Remove a ki counter from Scarmaker: Target creature gains fear until end of turn. (It can't be blocked except by artifact creatures and/or black creatures.)",
					type       : "Legendary Creature — Spirit",
					supertypes : ["Legendary"],
					types      : ["Creature"],
					subtypes   : ["Spirit"],
					power      : "4",
					toughness  : "4",
					imageName  : "scarmaker"
				}
			}
		],
		SOK :
		[
			{ match : {name: "Erayo's Essence"}, remove : ["power", "toughness"] },
			{ match : {name: "Homura's Essence"}, remove : ["power", "toughness"] },
			{ match : {name: "Kuon's Essence"}, remove : ["power", "toughness"] },
			{ match : {name: "Rune-Tail's Essence"}, remove : ["power", "toughness"] },
			{ match : {name: "Sasaya's Essence"}, remove : ["power", "toughness"] }
		],
		ZEN :
		[
			{ match : {imageName : "forest1"}, replace : {imageName : "forest1",  number : "246"} },
			{ match : {imageName : "forest2"}, replace : {imageName : "forest1a", number : "246a"} },
			{ match : {imageName : "forest3"}, replace : {imageName : "forest2",  number : "247"} },
			{ match : {imageName : "forest4"}, replace : {imageName : "forest2a", number : "247a"} },
			{ match : {imageName : "forest5"}, replace : {imageName : "forest3",  number : "248"} },
			{ match : {imageName : "forest6"}, replace : {imageName : "forest3a", number : "248a"} },
			{ match : {imageName : "forest7"}, replace : {imageName : "forest4",  number : "249"} },
			{ match : {imageName : "forest8"}, replace : {imageName : "forest4a", number : "249a"} },
			{ match : {imageName : "island1"}, replace : {imageName : "island1",  number : "234"} },
			{ match : {imageName : "island2"}, replace : {imageName : "island1a", number : "234a"} },
			{ match : {imageName : "island3"}, replace : {imageName : "island2",  number : "235"} },
			{ match : {imageName : "island4"}, replace : {imageName : "island2a", number : "235a"} },
			{ match : {imageName : "island5"}, replace : {imageName : "island3",  number : "236"} },
			{ match : {imageName : "island6"}, replace : {imageName : "island3a", number : "236a"} },
			{ match : {imageName : "island7"}, replace : {imageName : "island4",  number : "237"} },
			{ match : {imageName : "island8"}, replace : {imageName : "island4a", number : "237a"} },
			{ match : {imageName : "mountain1"}, replace : {imageName : "mountain1",  number : "242"} },
			{ match : {imageName : "mountain2"}, replace : {imageName : "mountain1a", number : "242a"} },
			{ match : {imageName : "mountain3"}, replace : {imageName : "mountain2",  number : "243"} },
			{ match : {imageName : "mountain4"}, replace : {imageName : "mountain2a", number : "243a"} },
			{ match : {imageName : "mountain5"}, replace : {imageName : "mountain3",  number : "244"} },
			{ match : {imageName : "mountain6"}, replace : {imageName : "mountain3a", number : "244a"} },
			{ match : {imageName : "mountain7"}, replace : {imageName : "mountain4",  number : "245"} },
			{ match : {imageName : "mountain8"}, replace : {imageName : "mountain4a", number : "245a"} },
			{ match : {imageName : "plains1"}, replace : {imageName : "plains1",  number : "230"} },
			{ match : {imageName : "plains2"}, replace : {imageName : "plains1a", number : "230a"} },
			{ match : {imageName : "plains3"}, replace : {imageName : "plains2",  number : "231"} },
			{ match : {imageName : "plains4"}, replace : {imageName : "plains2a", number : "231a"} },
			{ match : {imageName : "plains5"}, replace : {imageName : "plains3",  number : "232"} },
			{ match : {imageName : "plains6"}, replace : {imageName : "plains3a", number : "232a"} },
			{ match : {imageName : "plains7"}, replace : {imageName : "plains4",  number : "233"} },
			{ match : {imageName : "plains8"}, replace : {imageName : "plains4a", number : "233a"} },
			{ match : {imageName : "swamp1"}, replace : {imageName : "swamp1",  number : "238"} },
			{ match : {imageName : "swamp2"}, replace : {imageName : "swamp1a", number : "238a"} },
			{ match : {imageName : "swamp3"}, replace : {imageName : "swamp2",  number : "239"} },
			{ match : {imageName : "swamp4"}, replace : {imageName : "swamp2a", number : "239a"} },
			{ match : {imageName : "swamp5"}, replace : {imageName : "swamp3",  number : "240"} },
			{ match : {imageName : "swamp6"}, replace : {imageName : "swamp3a", number : "240a"} },
			{ match : {imageName : "swamp7"}, replace : {imageName : "swamp4",  number : "241"} },
			{ match : {imageName : "swamp8"}, replace : {imageName : "swamp4a", number : "241a"} }
		],
		UGL :
		[
			{ match : {name : "B.F.M. (Big Furry Monster)", number : "28b"}, replace : {imageName : "b.f.m. 1", number : "28"}},
			{ match : {name : "B.F.M. (Big Furry Monster)", number : "29b"}, replace : {imageName : "b.f.m. 2", number : "29"}},
			{ match : {name : "The Ultimate Nightmare of Wizards of the Coast® Customer Service"}, replace : {imageName : "the ultimate nightmare of wizards of the coastr customer service", manaCost : "{X}{Y}{Z}{R}{R}"}},
			{ match : {name : "Forest"}, replace : {border : "black"}},
			{ match : {name : "Island"}, replace : {border : "black"}},
			{ match : {name : "Mountain"}, replace : {border : "black"}},
			{ match : {name : "Plains"}, replace : {border : "black"}},
			{ match : {name : "Swamp"}, replace : {border : "black"}}
		],
		UNH :
		[
			{ match : {name : "Cheap Ass"}, replace : {text : "Spells you play cost {½} less to play."}},
			{ match : {name : "Flaccify"}, replace : {text : "Counter target spell unless its controller pays {3}{½}."}},
			{ match : {name : "Kill Destroy"}, replace : {name : "Kill! Destroy!", imageName : "kill! destroy!"}},
			{ match : {name : "Little Girl"}, replace : {manaCost : "{hw}"}},
			{ match : {name : "Look at Me, I'm R&D"}, replace : {artist : "spork;"} },
			{ match : {name : "Our Market Research Shows That Players Like Really Long Card Names So We Made this Card to Have the Absolute Longest Card Name Ever Elemental"}, replace : {imageName : "our market research shows that players like really long card names so we made"}},
			{ match : {name : "Forest"}, replace : {border : "black"}},
			{ match : {name : "Island"}, replace : {border : "black"}},
			{ match : {name : "Mountain"}, replace : {border : "black"}},
			{ match : {name : "Plains"}, replace : {border : "black"}},
			{ match : {name : "Swamp"}, replace : {border : "black"}},
			{ match : {name : "Who/What/When/Where/Why"}, replace : { layout : "split", names : ["Who", "What", "When", "Where", "Why"] }},
			{ copyCard : "Who/What/When/Where/Why", replace :
				{
					name         : "Who",
					number       : "120a",
					text         : "Target player gains X life.",
					originalText : "Target player gains X life.",
					manaCost     : "{X}{W}",
					cmc          : 1,
					colors       : ["White"],
					foreignNames : [{language : "French", name : "Qui"}]
				}
			},
			{ copyCard : "Who/What/When/Where/Why", replace :
				{
					name         : "What",
					number       : "120b",
					text         : "Destroy target artifact.",
					originalText : "Destroy target artifact.",
					manaCost     : "{2}{R}",
					cmc          : 3,
					colors       : ["Red"],
					foreignNames : [{language : "French", name : "Quoi"}]
				}
			},
			{ copyCard : "Who/What/When/Where/Why", replace :
				{
					name         : "When",
					number       : "120c",
					text         : "Counter target creature spell.",
					originalText : "Counter target creature spell.",
					manaCost     : "{2}{U}",
					cmc          : 3,
					colors       : ["Blue"],
					foreignNames : [{language : "French", name : "Quand"}]
				}
			},
			{ copyCard : "Who/What/When/Where/Why", replace :
				{
					name         : "Where",
					number       : "120d",
					text         : "Destroy target land.",
					originalText : "Destroy target land.",
					manaCost     : "{3}{B}",
					cmc          : 4,
					colors       : ["Black"],
					foreignNames : [{language : "French", name : "Où"}]
				}
			},
			{ match : {name : "Who/What/When/Where/Why"}, replace : { name : "Why", number : "120e", text : "Destroy target enchantment.", originalText : "Destroy target enchantment.", manaCost : "{1}{G}", cmc : 2, colors : ["Green"], foreignNames : [{language : "French", name : "Pourquoi"}] }},
		],
		EVG :
		[
			{ match : {name : "Elemental"}, replace : {number : "T1", layout : "token"}},
			{ match : {name : "Elf Warrior"}, replace : {number : "T2", layout : "token"}},
			{ match : {name : "Goblin"}, replace : {number : "T3", layout : "token"}}
		],
		DD2 :
		[
			{ match : {name : "Elemental Shaman"}, replace : {number : "T1", layout : "token"}}
		],
		DDC :
		[
			{ match : {name : "Demon"}, replace : {number : "T2", layout : "token"}},
			{ match : {name : "Spirit"}, replace : {number : "T1", layout : "token"}},
			{ match : {name : "Thrull"}, replace : {number : "T3", layout : "token"}}
		],
		DDD :
		[
			{ match : {name : "Beast", number : "1"}, replace : {number : "T1", layout : "token"}},
			{ match : {name : "Beast", number : "2"}, replace : {number : "T2", layout : "token"}},
			{ match : {name : "Elephant"}, replace : {number : "T3", layout : "token"}},
			{ match : {name : "Basking Rootwalla"}, replace : {layout : "normal"}},
			{ match : {name : "Garruk Wildspeaker"}, replace : {layout : "normal"}}
		],
		DDE :
		[
			{ match : {name : "Hornet"}, replace : {number : "T1", layout : "token"}},
			{ match : {name : "Minion"}, replace : {number : "T2", layout : "token"}},
			{ match : {name : "Saproling"}, replace : {number : "T3", layout : "token"}}
		],
		POR :
		[
			{ renumberImages : "Anaconda", order : [4287, 4288] },
			{ renumberImages : "Blaze", order : [4328, 4329] },
			{ renumberImages : "Forest", order : [4413, 4414, 4415, 4416] },
			{ renumberImages : "Island", order : [4421, 4422, 4423, 4424] },
			{ renumberImages : "Monstrous Growth", order : [4304, 4305] },
			{ renumberImages : "Mountain", order : [4417, 4419, 4418, 4420] },
			{ renumberImages : "Plains", order : [4425, 4426, 4427, 4428] },
			{ renumberImages : "Swamp", order : [4409, 4410, 4411, 4412] }
		],
		PO2 :
		[
			{ renumberImages : "Forest", order : [8409, 8410, 8408] },
			{ renumberImages : "Island", order : [8387, 8390, 8391] },
			{ renumberImages : "Mountain", order : [8395, 8406, 8407] },
			{ renumberImages : "Plains", order : [8380, 8374, 8354] },
			{ renumberImages : "Swamp", order : [8394, 8392, 8393] }
		],
		S99 :
		[
			{ match : {imageName : "forest1"}, replace : {number : "170", artist : "Quinton Hoover"} },
			{ match : {imageName : "forest2"}, replace : {number : "171", artist : "Quinton Hoover"} },
			{ match : {imageName : "forest3"}, replace : {number : "172", artist : "John Avon"} },
			{ match : {imageName : "forest4"}, replace : {number : "173", artist : "John Avon"} },
			{ match : {imageName : "mountain1"}, replace : {number : "166"} },
			{ match : {imageName : "mountain2"}, replace : {number : "167", artist : "John Avon"} },
			{ match : {imageName : "mountain3"}, replace : {number : "168"} },
			{ match : {imageName : "mountain4"}, replace : {number : "169", artist : "Brian Durfee"} },
			{ match : {imageName : "plains1"}, replace : {number : "154"} },
			{ match : {imageName : "plains2"}, replace : {number : "155", artist : "Tom Wänerstrand"} },
			{ match : {imageName : "plains3"}, replace : {number : "156"} },
			{ match : {imageName : "plains4"}, replace : {number : "157", artist : "Fred Fields"} },
			{ match : {imageName : "swamp1"}, replace : {number : "162", artist : "Romas"} },
			{ match : {imageName : "swamp2"}, replace : {number : "163", artist : "Dan Frazier"} },
			{ match : {imageName : "swamp3"}, replace : {number : "164", artist : "Douglas Shuler"} },
			{ match : {imageName : "swamp4"}, replace : {number : "165", artist : "Romas"} }
		],
		DDL :
		[
			{ match : { name : "Anax and Cymede" }, replace : {text : "First strike, vigilance\n\nHeroic — Whenever you cast a spell that targets Anax and Cymede, creatures you control get +1/+1 and gain trample until end of turn."}},
			{ match : { name : "Cavalry Pegasus" }, replace : {text : "Flying\n\nWhenever Cavalry Pegasus attacks, each attacking Human gains flying until end of turn."}},
			{ match : { name : "Ordeal of Purphoros" }, replace : {text : "Enchant creature\n\nWhenever enchanted creature attacks, put a +1/+1 counter on it. Then if it has three or more +1/+1 counters on it, sacrifice Ordeal of Purphoros.\n\nWhen you sacrifice Ordeal of Purphoros, it deals 3 damage to target creature or player."}},
			{ match : { name : "Polukranos, World Eater" }, replace : {text : "{X}{X}{G}: Monstrosity X. (If this creature isn't monstrous, put X +1/+1 counters on it and it becomes monstrous.)\n\nWhen Polukranos, World Eater becomes monstrous, it deals X damage divided as you choose among any number of target creatures your opponents control. Each of those creatures deals damage equal to its power to Polukranos."}}
		],
		THS :
		[
			{ match : { name : "Colossus of Akros" }, replace : {text : "Defender, indestructible\n\n{10}: Monstrosity 10. (If this creature isn't monstrous, put ten +1/+1 counters on it and it becomes monstrous.)\n\nAs long as Colossus of Akros is monstrous, it has trample and can attack as though it didn't have defender."}},
			{ match : { name : "Time to Feed" }, replace : {text : "Choose target creature an opponent controls. When that creature dies this turn, you gain 3 life. Target creature you control fights that creature. (Each deals damage equal to its power to the other.)"}}
		],
		PPR :
		[
			{ match : {name : "Shield of Kaldra"}, replace : {rarity : "Special"}}
		],
		VAN :
		[
			{ match : {name : "Akroma, Angel of Wrath"}, replace : {artist : "Ron Spears", flavor : "No rest. No mercy. No matter what."}},
			{ match : {name : "Arcanis, the Omnipotent"}, replace : {artist : "Justin Sweet", flavor : "Do not concern yourself with my origin, my race, or my ancestry. Seek my record in the pits, and then make your wager."}},
			{ match : {name : "Arcbound Overseer"}, replace : {artist : "Carl Critchlow", flavor : ""}},
			{ match : {name : "Ashling the Pilgrim"}, replace : {flavor : ""}},
			{ match : {name : "Ashling, the Extinguisher"}, replace : {flavor : "The Aurora had transformed her into a relentless force of destruction."}},
			{ match : {multiverseid : 214824}, replace : {artist : "Marcelo Vignali", flavor : "Long ago, birds of paradise littered the skies. Thanks to the city's sprawl, most now exist as pets of society's elite."}},
			{ match : {multiverseid : 182291}, replace : {flavor : "Long ago, birds of paradise littered the skies. Thanks to the city's sprawl, most now exist as pets of society's elite."}},
			{ match : {name : "Bosh, Iron Golem"}, replace : {artist : "Brom", flavor : "As Glissa searches for the truth about Memnarch, Bosh searches to unearth the secrets buried deep in his memory."}},
			{ match : {name : "Braids, Conjurer Adept"}, replace : {artist : "Zoltan Boros & Gabor Szikszai", flavor : "The rifted multiverse became a sea of conflciting realities, each peopled by possible versions of every living being."}},
			{ match : {name : "Chronatog"}, replace : {artist : "Christopher Rush", flavor : "For the chronatog, there is no meal like the present."}},
			{ match : {name : "Dakkon Blackblade"}, replace : {life : 3, artist : "Richard Kane-Ferguson", flavor : "\"My power is as vast as the plains, my strength is that of mountains. Each wave that crashes upon the shore thunders like blood in my veins.\" — Memoirs"}},
			{ match : {name : "Dauntless Escort"}, replace : {flavor : "Elspeth's squires do not seek advancement. For them, no jknightly glory could surpass the glory of serving their champion."}},
			{ match : {name : "Diamond Faerie"}, replace : {artist : "Heather Hudson", flavor : "\"That such delicate creatures could become so powerful in the embrace of winter is yet more proof that I am right.\" — Heidar, Rimewind Master"}},
			{ match : {name : "Eight-and-a-Half-Tails"}, replace : {artist : "Daren Bader", flavor : "Virtue is an inner light that can prevail in every soul."}},
			{ match : {name : "Eladamri, Lord of Leaves"}, replace : {flavor : "\"We have been patient. We have planned our attack. We are ready... now.\" — Eladamri, Lord of Leaves"}},
			{ match : {name : "Elvish Champion"}, replace : {artist : "Mark Zug", flavor : "\"For what are leaves but countless blades to fight a countless foe on high\" — Elvish hymn"}},
			{ match : {name : "Enigma Sphinx"}, replace : {flavor : ""}},
			{ match : {multiverseid : 182259}, replace : {artist : "Greg Staples", flavor : "He provides a safe path to nowhere."}},
			{ match : {multiverseid : 210148}, replace : {flavor : "He provides a safe path to nowhere."}},
			{ match : {name : "Etched Oracle"}, replace : {artist : "Matt Cavotta", flavor : ""}},
			{ match : {name : "Fallen Angel"}, replace : {artist : "Mathew D. Wilson", flavor : "Why do you weep for the dead? I rejoice, for they have died for me."}},
			{ match : {name : "Figure of Destiny"}, replace : {flavor : ""}},
			{ match : {name : "Flametongue Kavu"}, replace : {artist : "Pete Venters", flavor : "\"For dim-witted, thick-skulled genetic mutants, they have pretty good aim.\" — Sisay"}},
			{ match : {name : "Frenetic Efreet"}, replace : {artist : "Tom Gianni", flavor : ""}},
			{ match : {multiverseid : 182251}, replace : {artist : "Tim Hilderbrandt", flavor : "They poured from the Skirk Ridge like lava, burning and devouring everything in their path."}},
			{ match : {multiverseid : 210149}, replace : {flavor : "They poured from the Skirk Ridge like lava, burning and devouring everything in their path."}},
			{ match : {multiverseid : 182304}, replace : {artist : "Mark Zug", flavor : "It's drawn to the scent of screaming."}},
			{ match : {multiverseid : 210150}, replace : {flavor : "It's drawn to the scent of screaming."}},
			{ match : {name : "Haakon, Stromgald Scourge"}, replace : {artist : "Mark Zug", flavor : ""}},
			{ match : {name : "Heartwood Storyteller"}, replace : {hand : 0, life : 7, artist : "Anthony S. Waters", flavor : "His roots reach deep, nurtured not by soil and rain, but by millennia of experience."}},
			{ match : {name : "Hell's Caretaker"}, replace : {artist : "Greg Staples", flavor : "You might leave here, Chenndra, should another take your place..."}},
			{ match : {name : "Hermit Druid"}, replace : {flavor : "Seeking the company of plants ensures that your wits will go to seed."}},
			{ match : {name : "Higure, the Still Wind"}, replace : {artist : "Christopher Moeller", flavor : ""}},
			{ match : {name : "Ink-Eyes, Servant of Oni"}, replace : {artist : "Wayne Reynolds", flavor : ""}},
			{ match : {name : "Jaya Ballard"}, replace : {flavor : ""}},
			{ match : {name : "Jhoira of the Ghitu"}, replace : {life : 3, artist : "Kev Walker", flavor : ""}},
			{ match : {name : "Karona, False God"}, replace : {artist : "Matthew D. Wilson", flavor : ""}},
			{ match : {name : "Kresh the Bloodbraided"}, replace : {flavor : "Each of his twenty-two braids is bound with bone and leather from a foe."}},
			{ match : {name : "Loxodon Hierarch"}, replace : {artist : "Kev Walker", flavor : "I have lived long, and I remember how this city once was. If my death serves to bring back the Ravnica in my memory, then so be it."}},
			{ match : {name : "Lyzolda, the Blood Witch"}, replace : {artist : "Jim Nelson", flavor : "Sacrificial rites take place before an audience of cheerign cultists, each begging to be the next on stage."}},
			{ match : {name : "Maelstrom Archangel"}, replace : {flavor : ""}},
			{ match : {name : "Malfegor"}, replace : {flavor : "The blood of the demons quickened as their master rose over the battlefield. The blood of the angels also quickened: here was the chance to finally end the war started millennia ago."}},
			{ match : {name : "Maralen of the Mornsong"}, replace : {flavor : ""}},
			{ match : {name : "Maro"}, replace : {hand : 1, artist : "Stuart Griffin", flavor : "No two see the same Maro."}},
			{ match : {name : "Master of the Wild Hunt"}, replace : {flavor : ""}},
			{ match : {name : "Mayael the Anima"}, replace : {flavor : "The sacred Anima's eyes are blind to all but the grandest truths."}},
			{ match : {name : "Mirri the Cursed"}, replace : {hand : 0, life : -5, artist : "Kev Walker", flavor : "A hero fails, a martyr falls. Time twists and destinies interchange."}},
			{ match : {name : "Mirror Entity"}, replace : {flavor : "Unaware of Lorwyn's diversity, it sees only itself, refelected a thousand times over."}},
			{ match : {name : "Momir Vig, Simic Visionary"}, replace : {artist : "Zoltan Boras & Gabor Szikszai", flavor : ""}},
			{ match : {name : "Morinfen"}, replace : {flavor : "\"I looked into its eyes, and its soul was so empty I saw no reflection, no light there.\" — Crovax"}},
			{ match : {name : "Murderous Redcap"}, replace : {flavor : ""}},
			{ match : {name : "Necropotence"}, replace : {flavor : ""}},
			{ match : {name : "Nekrataal"}, replace : {hand : -1, artist : "Adrian Smith", flavor : "\"I have seen the horrors Kaervek has freed. My betrayal is certain - but of Kaervek or of Jamuraa, I cannot say.\" — Jolrael"}},
			{ match : {name : "Oni of Wild Places"}, replace : {artist : "Mark Tedin", flavor : "The oni leapt easily from peak to peak, toying with its victims, its voice a purry frmo the rumbling depths of nightmare."}},
			{ match : {name : "Orcish Squatters"}, replace : {flavor : ""}},
			{ match : {name : "Peacekeeper"}, replace : {flavor : "\"I have always imagined my mother as such a woman, strong and wise.\" — Sisay, journal"}},
			{ match : {name : "Phage the Untouchable"}, replace : {artist : "Ron Spears", flavor : ""}},
			{ match : {multiverseid : 214825}, replace : {artist : "Brom", flavor : "In its heart lies the secret of immortality."}},
			{ match : {multiverseid : 182292}, replace : {flavor : "In its heart lies the secret of immortality."}},
			{ match : {multiverseid : 182276}, replace : {artist : "Douglas Shuler", flavor : "Ocassionally, members of the Institute of Arcane Study acquire a taste for worldy pleasures. Seldom do they have trouble finding employment."}},
			{ match : {multiverseid : 210151}, replace : {artist : "Tony Szczudlo", flavor : "He wastes his amazing talents on proving how amazing he really is."}},
			{ match : {name : "Raksha Golden Cub"}, replace : {artist : "Pete Venters", flavor : "Some believe that Raksha, yougnest of the kha, is the reincarnation of Dakan, the first and mightiest of leonin leaders."}},
			{ match : {name : "Reaper King"}, replace : {flavor : "It's harvest time."}},
			{ match : {name : "Rith, the Awakener"}, replace : {flavor : ""}},
			{ match : {multiverseid : 214827}, replace : {life : -3, artist : "Mark Zug", flavor : "Trained in the arts of stealth, royal assassins choose their victims carefully, relying on timing and precision rather than brute force."}},
			{ match : {multiverseid : 182260}, replace : {flavor : "Trained in the arts of stealth, royal assassins choose their victims carefully, relying on timing and precision rather than brute force."}},
			{ match : {name : "Rumbling Slum"}, replace : {artist : "Carl Critchlow", flavor : "The Orzhov contract the Izzet to animate slum districts and banish them to the wastes. The Gruul adopt them and send them back to the city for vengeance."}},
			{ match : {name : "Sakashima the Impostor"}, replace : {artist : "rk post", flavor : ""}},
			{ match : {multiverseid : 182282}, replace : {artist : "Greg Staples", flavor : "Her sword sings more beautifully than any choir."}},
			{ match : {multiverseid : 205492}, replace : {flavor : "Her sword sings more beautifully than any choir."}},
			{ match : {name : "Seshiro the Anointed"}, replace : {artist : "Daren Bader", flavor : "His family was the first to reach out to the human monks. He soon knew as many koans as he did blade strikes."}},
			{ match : {name : "Sisters of Stone Death"}, replace : {artist : "Donato Giancola", flavor : ""}},
			{ match : {name : "Sliver Queen"}, replace : {flavor : "Her children are ever part of her."}},
			{ match : {name : "Squee, Goblin Nabob"}, replace : {artist : "Greg Staples", flavor : "\"Some goblins are expendable. Some are impossible to get rid of. But he's both - at the same time!\" — Starke"}},
			{ match : {name : "Stalking Tiger"}, replace : {artist : "Terese Nielsen", flavor : "Int he Jamuraan jungles, there is often no serpating beauty from danger."}},
			{ match : {name : "Stonehewer Giant"}, replace : {flavor : ""}},
			{ match : {name : "Stuffy Doll"}, replace : {artist : "Dave Allsop", flavor : ""}},
			{ match : {name : "Tawnos"}, replace : {artist : "Donato Giancola"}},
			{ match : {name : "Teysa, Orzhov Scion"}, replace : {artist : "Todd Lockwood", flavor : ""}},
			{ match : {name : "Tradewind Rider"}, replace : {flavor : "It is said the wind will blow the world past if you wait long enough."}},
			{ match : {name : "Two-Headed Giant of Foriys"}, replace : {artist : "Anson Maddocks", flavor : "None know if this Giant is the result of abberant magics, Siamese twins, or a mentalist's schizophrenia."}},
			{ match : {name : "Vampire Nocturnus"}, replace : {flavor : "\"Your life with set with the sun.\""}},
			{ match : {name : "Viridian Zealot"}, replace : {artist : "Kev Walker", flavor : "\"I will fight only the way nature intended-and nature intended us to win.\""}}
		],
		ATH :
		[
			{ match : {name : "Aesthir Glider"}, replace : {originalText : "Flying\n\nAesthir Glider cannot block."}},
			{ match : {name : "Armored Pegasus"}, replace : {originalType : "Creature — Pegasus"}},
			{ match : {name : "Benalish Knight"}, replace : {originalText : "First strike\n\nYou may play Benalish Knight any time you could play an instant."}},
			{ match : {name : "Brushland"}, replace : {artist : "Bryon Wackwitz"}},
			{ match : {name : "Combat Medic"}, replace : {artist : "Liz Danforth", originalText : "{1}{W}: Prevent 1 damage to a creature or player."}},
			{ match : {name : "Cuombajj Witches"}, replace : {originalText : "{T}: Cuombajj Witches deals 1 damage to target creature or player of your choice and 1 damage to target creature or player of an opponent's choice. (Choose your target first.)"}},
			{ match : {name : "Erhnam Djinn"}, replace : {originalText : "During your upkeep, target non-Wall creature an opponent controls gains forestwalk until your next turn. (If defending player controls a forest, that creature is unblockable.)"}},
			{ match : {name : "Feast of the Unicorn"}, replace : {originalText : "Target creature gets +4/+0."}},
			{ match : {name : "Fireball"}, replace : {originalText : "At the time you play Fireball, pay an additional {1} for each target beyond the first.\n\nFireball deals X damage divided evenly, rounded down, among any number of target creatures and/or players."}},
			{ match : {name : "Giant Growth"}, replace : {artist : "Sandra Everingham"}},
			{ match : {name : "Giant Spider"}, replace : {originalText : "Giant Spider can block creatures with flying."}},
			{ match : {name : "Goblin Balloon Brigade"}, replace : {originalText : "{R}: Goblin Balloon Brigade gains flying until end of turn."}},
			{ match : {name : "Goblin Digging Team"}, replace : {originalType : "Summon — Goblins"}},
			{ match : {name : "Goblin Grenade"}, replace : {originalText : "At the time you play Goblin Grenade, sacrifice a Goblin.\n\nGoblin Grenade deals 5 damage to target creature or player.", artist : "Ron Spencer"}},
			{ match : {name : "Goblin Hero"}, replace : {originalType : "Summon — Goblin"}},
			{ match : {name : "Goblin King"}, replace : {originalType : "Summon — Lord", originalText : "All goblins get +1/+1 and gain mountainwalk. (If defending player controls a mountain, those creatures are unblockable.)", artist : "Jesper Myrfors"}},
			{ match : {name : "Goblin Matron"}, replace : {originalText : "When Goblin Matron comes into play, you may search your library for a Goblin card. If you do, reveal that card, put it into your hand, and shuffle your library afterward."}},
			{ match : {name : "Goblin Mutant"}, replace : {originalText : "Trample\n\nGoblin Mutant cannot attack if defending player controls an untapped creature with power 3 or more.\n\nGoblin Mutant cannot block a creature with power 3 or more."}, remove : ["flavor"]},
			{ match : {name : "Goblin Recruiter"}, replace : {originalText : "When Goblin Recruiter comes into play, search your library for any number of Goblin cards and reveal them to all players. Shuffle your library, then put the revealed cards on top of it in any order.", originalType : "Summon — Goblin"}},
			{ match : {name : "Goblin Snowman"}, replace : {originalText : "When Goblin Snowman blocks, it does not deal or receive combat damage that turn.\n\n{T}: Goblin Snowman deals 1 damage to target creature it is blocking."}},
			{ match : {name : "Goblin Tinkerer"}, replace : {originalText : "{R}, {T}: Destroy target artifact. That artifact deals damage equal to its total casting cost to Goblin Tinkerer."}},
			{ match : {name : "Goblin Warrens"}, replace : {originalText : "{2}{R}, Sacrifice two Goblins: Put three Goblin tokens into play. Treat these tokens as 1/1 red creatures."}},
			{ match : {name : "Hymn to Tourach"}, replace : {originalText : "Target player discards two cards at random from his or her hand. (If that player has only one card, he or she discards it.)"}, remove : ["flavor"]},
			{ match : {name : "Hypnotic Specter"}, replace : {originalText : "Flying\n\nWhenever Hypnotic Specter successfully deals damage to an opponent, that player discards a card at random from his or her hand."}, remove : ["flavor"]},
			{ match : {name : "Icatian Javelineers"}, replace : {originalText : "When Icatian Javelineers comes into play, put a javelin counter on it.\n\n{T}, Remove a javelin counter from Icatian Javelineers: Icatian Javelineers deals 1 damage to target creature or player."}},
			{ match : {name : "Infantry Veteran"}, replace : {originalType : "Summon — Soldier"}},
			{ match : {name : "Jalum Tome"}, replace : {originalText : "{2}, {T}: Draw a card, then choose and discard a card."}},
			{ match : {name : "Knight of Stromgald"}, replace : {originalText : "Protection from white\n\n{B}: Knight of Stromgald gains first strike until end of turn.\n\n{B}{B}: Knight of Stromgald gets +1/+0 until end of turn."}, remove : ["flavor"]},
			{ match : {name : "Llanowar Elves"}, replace : {originalText : "{T}: Add {G} to your mana pool. Play this ability as a mana source."}},
			{ match : {name : "Mogg Flunkies"}, replace : {originalText : "Mogg Flunkies cannot attack or block unless another creature you control attacks or blocks the same turn."}},
			{ match : {name : "Order of the White Shield"}, replace : {originalText : "Protection from black\n\n{W}: Order of the White Shield gains first strike until end of turn.\n\n{W}{W}: Order of the White Shield gets +1/+0 until end of turn."}},
			{ match : {name : "Pacifism"}, replace : {originalText : "Enchanted creature cannot attack or block."}},
			{ match : {name : "Pyrokinesis"}, replace : {originalText : "You may remove a red card in your hand from the game instead of paying Pyrokinesis's casting cost.\n\nPyrokinesis deals 4 damage divided any way you choose among any number of target creatures."}, remove : ["flavor"]},
			{ match : {name : "Pyrotechnics" }, replace : {flavor : "\"Hi! ni! ya! Behold the man of flint, that's me! / Four lightnings zigzag from me, strike and return.\"\n\n—Navajo war chant"}},
			{ match : {name : "Raging Goblin"}, replace : {originalText : "Raging Goblin is unaffected by summoning sickness.", flavor : "Charging alone takes uncommong daring or uncommon stupidity. Or both.", artist : "Brian Snōddy"}},
			{ match : {name : "Samite Healer"}, replace : {originalType : "Summon — Cleric", originalText : "{T}: Prevent 1 damage to a creature or player."}},
			{ match : {name : "Scavenger Folk"}, replace : {originalText : "{G}, {T}, Sacrifice Scavenger Folk: Destroy target artifact."}},
			{ match : {name : "Serrated Arrows"}, replace : {originalText : "Serrated Arrows comes into play with three arrowhead counters on it.\n\nWhen there are no arrowhead counters on Serrated Arrows, destroy it.\n\n{T}, Remove an arrowhead counter from Serrated Arrows: Put a -1/-1 counter on target creature."}},
			{ match : {name : "Spectral Bears"}, replace : {originalText : "When Spectral Bears attacks, if defending player controls no black cards, Spectral Bears does not untap during your next untap phase."}},
			{ match : {name : "Strip Mine"}, replace : {originalText : "{T}: Add one colors mana to your mana pool.\n\n{T}, Sacrifice Strip Mine: Destroy target land."}},
			{ match : {name : "Swords to Plowshares"}, replace : {originalText : "Remove target creature from the game. That creature's controller gains life equal to its power."}},
			{ match : {name : "Terror"}, replace : {originalText : "Destroy target nonartifact, nonblack creature. That creature cannot be regenerated this turn."}},
			{ match : {name : "Unholy Strength"}, replace : {originalText : "Enchanted creature gets +2/+1."}},
			{ match : {name : "Uthden Troll"}, replace : {originalText : "{R}: Regenerate Uthden Troll."}},
			{ match : {name : "Volcanic Dragon"}, replace : {originalText : "Flying\n\nVolcanic Dragon is unaffected by summoning sickness."}},
			{ match : {name : "Woolly Spider"}, replace : {originalText : "Wooly Spider can block creatures with flying.\n\nWhen Woolly Spider blocks a creature with flying, Woolly Spider gets +0/+2 until end of turn."}}
		],
		ITP :
		[
			{ match : {name : "Alabaster Potion"}, replace : {originalText : "Target player gains X life, or prevent X damage to any creature or player."}},
			{ match : {name : "Battering Ram"}, replace : {originalText : "Banding when attacking\n\nWhenever a wall blocks Battering Ram, destroy that creature at end of combat."}},
			{ match : {name : "Bog Wraith"}, replace : {originalText : "Swampwalk"}},
			{ match : {name : "Circle of Protection: Black"}, replace : {originalText : "{1}: Prevent all damage to you from one black source. Further damage from that source is treated normally."}},
			{ match : {name : "Circle of Protection: Red"}, replace : {originalText : "{1}: Prevent all damage to you from one red source. Further damage from that source is treated normally."}},
			{ match : {name : "Cursed Land"}, replace : {originalText : "During enchanted land's controller's upkeep, Cursed Land deals 1 damage to the player."}},
			{ match : {name : "Detonate"}, replace : {originalText : "Bury target artifact with casting cost equal to X. Detonate deals X damage to that artifact's controller."}},
			{ match : {name : "Disintegrate"}, replace : {originalText : "Disintegrate deals X damage to target creature or player. That creature cannot regenerate until end of turn. If the creature is dealt lethal damage this turn, remove it from the game."}},
			{ match : {name : "Elven Riders"}, replace : {originalText : "Elven Riders cannot be blocked except by creatures with flying or walls.", artist : "Melissa Benson"}},
			{ match : {name : "Energy Flux"}, replace : {originalText : "All artifacts in play gain \"During your upkeep, pay an additional {2} or bury this artifact.\""}},
			{ match : {name : "Feedback"}, replace : {originalText : "During enchanted enchantment's controller's upkeep, Feedback deals 1 damage to that player."}},
			{ match : {name : "Fireball"}, replace : {originalText : "Fireball deals X damage divided evenly, round down, among any number of target creatures and/or players. Pay an additional {1} for each target beyond the first."}},
			{ match : {name : "Healing Salve"}, replace : {originalText : "Target player gains 3 life, or prevent up to 3 damage to any creature or player."}},
			{ match : {name : "Ironclaw Orcs"}, replace : {originalText : "Ironclaw Orcs cannot be assigned to block any creature with power 2 or greater."}},
			{ match : {name : "Jayemdae Tome"}, replace : {originalText : "{4}, {T}: Draw a card."}},
			{ match : {name : "Mesa Pegasus"}, replace : {originalText : "Banding, flying"}},
			{ match : {name : "Murk Dwellers"}, replace : {originalText : "If Murk Dwellers attacks and is not blocked, it gets +2/+0 until end of combat."}},
			{ match : {name : "Power Sink"}, replace : {originalText : "Counter target spell unless that spell's caster pays an additional {X}. That player draws and pays all available mana from lands and mana pool until {X} is paid; he or she may also draw and pay mana from other sources if desired."}},
			{ match : {name : "Raise Dead"}, replace : {originalText : "Put target creature card from your graveyard into your hand."}},
			{ match : {name : "Reverse Damage"}, replace : {originalText : "All damage dealt to you frmo one source this turn is retroactively added to your life total instead of subtracted from it. Further damage from that source is treated normally."}},
			{ match : {name : "Twiddle"}, replace : {originalText : "Tap or untap target artifact, creature, or land."}},
			{ match : {name : "Untamed Wilds"}, replace : {originalText : "Search your library for a basic land card and put it into play. Shuffle your library afterwards."}},
			{ match : {name : "Wall of Bone"}, replace : {originalText : "{B}: Regenerate"}},
			{ match : {name : "Warp Artifact"}, replace : {originalText : "During enchanted artifact's controller's upkeep, Warp Artifact deals 1 damage to that player."}},
			{ match : {name : "Weakness"}, replace : {originalText : "Enchanted creature gets -2/-1."}},
			{ match : {name : "Whirling Dervish"}, replace : {originalText : "Protection from black\n\nAt the end of any turn in which Whirling Dervish damaged any opponent, put a +1/+1 counter on it."}},
			{ match : {name : "Winter Blast"}, replace : {originalText : "Tap X target creatures. Winter Blast deals 2 damage to each of those creatures with flying."}}
		],
		DKM :
		[
			{ match : {name : "Abyssal Specter"}, replace : {number : "1", originalText : "Flying\n\nWhenever Abyssal Specter deals damage to a player, that player discards a card from his or her hand."}},
			{ match : {name : "Balduvian Bears"}, replace : {number : "22", originalType : "Creature — Bear"}},
			{ match : {name : "Balduvian Horde"}, replace : {number : "10", originalText : "When Balduvian Horde comes into play, sacrifice it unless you discard a card at random from your hand."}},
			{ match : {name : "Barbed Sextant"}, replace : {number : "34", originalText : "{1}, {T}, Sacrifice Barbed Sextant: Add one mana of any color to your mana pool. Draw a card at the beginning of next turn's upkeep."}},
			{ match : {name : "Bounty of the Hunt"}, replace : {number : "23", originalText : "You may remove a green card in your hand from the game rather than pay Bounty of the Hunt's mana cost.\n\Choose one — Target creature gets +3/+3 until end of turn; or target creature gets +2/+2 and another target creature gets +1/+1 until end of turn; or three target creatures each get +1/+1 until end of turn."}},
			{ match : {name : "Contagion"}, replace : {number : "2", originalText : "You may pay 1 life and remove a black card in your hand from the game rather than pay Contagion's mana cost.\n\nPut two -2/-1 counters, distributed as you choose, on one or two target creatures."}},
			{ match : {name : "Dark Banishing"}, replace : {number : "3", originalText : "Destroy target nonblack creature. It can't be regenerated."}},
			{ match : {name : "Dark Ritual"}, replace : {number : "4"}},
			{ match : {name : "Death Spark"}, replace : {number : "11", originalText : "Death Spark deals 1 damage to target creature or player.\n\nAt the beginning of your upkeep, if Death Spark is in your graveyard with a creature card directly above it, you may pay {1}. If you do, return Death Spark to your hand."}},
			{ match : {name : "Elkin Bottle"}, replace : {number : "33", originalText : "{3}, {T}: Remove the top card of your library from the game face up. Until the beginning of your next upkeep, you may play that card as though it were in your hand. At the beginning of your next upkeep, if you haven't played the card, put it into your graveyard."}},
			{ match : {name : "Elvish Bard"}, replace : {number : "24", originalText : "All creatures able to block Elvish Bard do so."}},
			{ match : {name : "Folk of the Pines"}, replace : {number : "25", originalText : "{1}{G}: Folk of the Pines gets +1/+0 until end of turn."}},
			{ match : {name : "Forest"}, replace : {number : "48", originalText : "{G}"}},
			{ match : {name : "Foul Familiar"}, replace : {number : "5", originalText : "Foul Familiar can't black.\n\n{B}, Pay 1 life: Return Foul Familiar to its owner's hand."}},
			{ match : {name : "Fyndhorn Elves"}, replace : {number : "26", originalText : "{T}: Add {G} to your mana pool."}},
			{ match : {name : "Giant Growth"}, replace : {number : "27"}},
			{ match : {name : "Giant Trap Door Spider"}, replace : {number : "33", originalText : "{1}{R}{G}, {T}: Remove from the game Giant Trap Door Spider and target creature without flying that's attacking you."}},
			{ match : {name : "Goblin Mutant"}, replace : {number : "12", originalText : "Trample\n\nGoblin Mutant can't attack if defending player controls an untapped creature with power 3 or greater.\n\nGoblin Mutant can't block creatures with power 3 or greater."}},
			{ match : {name : "Guerrilla Tactics"}, replace : {number : "13a", artist : "Amy Weber", originalText : "Guerrilla Tactics deals 2 damage to target creature or player.\n\nWhen a spell or ability an opponent controls causes you to discard Guerrilla Tactics from your hand, Guerrilla Tactics deals 4 damage to target creature or player."}},
			{ match : {name : "Hurricane"}, replace : {number : "28"}},
			{ match : {name : "Icy Manipulator"}, replace : {number : "36"}},
			{ match : {name : "Incinerate"}, replace : {number : "14", originalText : "Incinerate deals 3 damage to target creature or player. A creature dealt damage this way can't be regenerated this turn."}},
			{ match : {name : "Jokulhaups"}, replace : {number : "15", originalText : "Destroy all artifacts, creatures, and lands. They can't be regenerated."}},
			{ match : {name : "Karplusan Forest"}, replace : {number : "39", originalText : "{T}: Add one colorless mana to your mana pool.\n\n{T}: Add {R} or {G} to your mana pool. Karplusan Forest deals 1 damage to you."}},
			{ match : {name : "Lava Burst"}, replace : {number : "16", originalText : "Lava Burst deals X damage to target creature or player. If Lava Burst would deal damage to a creature, that damage can't be prevented or dealt instead to another creature or player."}},
			{ match : {name : "Lhurgoyf"}, replace : {border : "black", number : "29", originalText : "Lhurgoyf's power is equal to the number of creature cards in all graveyards and its toughness is equal to that number plus 1."}},
			{ match : {name : "Mountain"}, replace : {number : "45", originalText : "{R}"}},
			{ match : {name : "Necropotence"}, replace : {border : "black", number : "7", originalText : "Skip your draw step.\n\nIf you would discard a card from your hand, remove that card from the game instead.\n\nPay 1 life: Remove the top card of your library from the game face down. At the end of your turn, put that card into your hand."}},
			{ match : {name : "Orcish Cannoneers"}, replace : {number : "17"}},
			{ match : {name : "Phantasmal Fiend"}, replace : {number : "8a", originalText : "{B}: Phantasmal Fiend gets +1/-1 until end of turn.\n\n{1}{U}: Switch Phantasmal Fiend's power and toughness until end of turn. Effects that would alter Phantasmal Fiend's power this turn alter its toughness instead, and vice versa."}},
			{ match : {name : "Phyrexian War Beast"}, replace : {number : "37a", originalText : "When Phyrexian War Beast leaves play, sacrifice a land and Phyrexian War Beast deals 1 damage to you."}},
			{ match : {name : "Pillage"}, replace : {number : "18", originalText : "Destroy target artifact or land. It can't be regenerated."}},
			{ match : {name : "Pyroclasm"}, replace : {number : "19"}},
			{ match : {name : "Shatter"}, replace : {number : "20"}},
			{ match : {name : "Soul Burn"}, replace : {number : "9", originalText : "Spend only black and/or red mana on X.\n\nSoul Burn deals X damage to target creature or player. You gain life equal to the damage dealt, but not more than the amount of {B} spent on X, the player's life total before Soul Burn dealt damage, or the creature's toughness."}},
			{ match : {name : "Storm Shaman"}, replace : {number : "21a", flavor : "\"Embrace the storm. Its voice shall echo within you, and its fire shall become your touch!\"\n\n—Lovisa Coldeyes, Balduvian chieftain", originalText : "{R}: Storm Shaman gets +1/+0 until end of turn."}},
			{ match : {name : "Sulfurous Springs"}, replace : {number : "40", originalText : "{T}: Add one colorless mana to your mana pool.\n\n{T}: Add {B} or {R} to your mana pool. Sulfurous Springs deals 1 damage to you."}},
			{ match : {name : "Swamp"}, replace : {number : "42", originalText : "{B}"}},
			{ match : {name : "Underground River"}, replace : {number : "41", originalText : "{T}: Add one colorless mana to your mana pool.\n\n{T}: Add {U} or {B} to your mana pool. Underground River deals 1 damage to you."}},
			{ match : {name : "Walking Wall"}, replace : {number : "38", originalText : "(Walls can't attack.)\n\n{3}: Walking Wall gets +3/-1 until end of turn and may attack this turn as though it weren't a Wall. Play this ability only once each turn.", artist : "Anthony S. Waters"}},
			{ match : {name : "Woolly Spider"}, replace : {number : "30", originalText : "Woolly Spider may block as though it had flying.\n\nWhenever Woolly Spider blocks a creature with flying, Woolly Spider gets +0/+2 until end of turn."}},
			{ match : {name : "Yavimaya Ancients"}, replace : {number : "31a", originalText : "{G}: Yavimaya Ancients gets +1/-2 until end of turn.", flavor : "\"We orphans of Fyndhorn have found no welcome in this alient place.\"\n\n — Taaveti of Kelsinko, elvish hunter"}},
			{ match : {name : "Yavimaya Ants"}, replace : {number : "32", originalText : "Trample; haste (This creature may attack and {T} the turn it comes under your control.)\n\nCumulative upkeep {G}{G} (At the beginning of your upkeep, put an age counter on this creature, then sacrifice it unless you pay {G}{G} for each age counter on it.)"}}
		],
		DPA :
		[
			"numberCards",
			{ match : {name : "Duskdale Wurm"}, remove : ["flavor"] },
			{ match : {name : "Forest"}, replace : {number : "110"}},
			{ match : {name : "Island"}, replace : {number : "98"}},
			{ match : {name : "Mind Control"}, replace : {artist : "Ryan Pancoast"}},
			{ match : {name : "Molimo, Maro-Sorcerer"}, remove : ["flavor"] },
			{ match : {name : "Mortivore"}, remove : ["flavor"] },
			{ match : {name : "Mountain"}, replace : {number : "106"}},
			{ match : {name : "River Boa"}, replace : {artist : "Paul Bonner"}, remove : ["flavor"]},
			{ match : {name : "Roughshod Mentor"}, remove : ["flavor"] },
			{ match : {name : "Shock"}, replace : {artist : "Jon Foster"}},
			{ match : {name : "Swamp"}, replace : {number : "102"}},
			{ match : {name : "Talara's Battalion"}, remove : ["flavor"] },
			{ match : {name : "The Rack"}, replace : {artist : "Nic Klein"}, remove : ["flavor"]},
			{ match : {name : "Troll Ascetic"}, remove : ["flavor"] }
		],
		"*" :
		[
			{ match : {name : "Draco"}, replace : {text : "Domain — Draco costs {2} less to cast for each basic land type among lands you control.\n\nFlying\n\nDomain — At the beginning of your upkeep, sacrifice Draco unless you pay {10}. This cost is reduced by {2} for each basic land type among lands you control."}},
			{ match : {name : "Spawnsire of Ulamog"}, replace : {text : "Annihilator 1 (Whenever this creature attacks, defending player sacrifices a permanent.)\n\n{4}: Put two 0/1 colorless Eldrazi Spawn creature tokens onto the battlefield. They have \"Sacrifice this creature: Add {1} to your mana pool.\"\n\n{20}: Cast any number of Eldrazi cards you own from outside the game without paying their mana costs."}},
			{ match : {name : "Jade Statue"}, remove : ["power", "toughness"] },
			{ match : {name : "Ghostfire"}, remove : ["colors"] }
		],
		XYZ :
		[
			{ renumberImages : "", order : [] },
			{ renumberImages : "", order : [] },
			{ renumberImages : "", order : [] },
			{ renumberImages : "", order : [] },
			{ renumberImages : "", order : [] }
		],
		XXX :
		[
			{ renumberImages : "Forest", order : [] },
			{ renumberImages : "Island", order : [] },
			{ renumberImages : "Mountain", order : [] },
			{ renumberImages : "Plains", order : [] },
			{ renumberImages : "Swamp", order : [] }
		]
	};
})(typeof exports==="undefined" ? window.C={} : exports);
