"use strict";

(function(exports)
{
    var isNode = typeof process!=="undefined" && typeof process.versions!=="undefined" && typeof process.versions.node!=="undefined";
    var base = isNode ? require("node-base") : window.base;

	exports.SUPERTYPES = ["Basic", "Legendary", "Snow", "World"];
	exports.TYPES = ["Instant", "Sorcery", "Artifact", "Creature", "Enchantment", "Land", "Planeswalker", "Tribal", "Plane", "Phenomenon", "Scheme", "Vanguard"];
	exports.SETS =
	[
		{
			name : "Limited Edition Alpha",
			code : "LEA",
			releaseDate : "1993-08-05",
			border : "black"
		},
		{
			name : "Limited Edition Beta",
			code : "LEB",
			releaseDate : "1993-10-01",
			border : "black"
		},
		{
			name : "Arabian Nights",
			code : "ARN",
			releaseDate : "1993-12-01",
			border : "black"
		},
		{
			name : "Unlimited Edition",
			code : "2ED",
			releaseDate : "1993-12-01",
			border : "white"
		},
		{
			name : "Antiquities",
			code : "ATQ",
			releaseDate : "1994-03-01",
			border : "black"
		},
		{
			name : "Revised Edition",
			code : "3ED",
			releaseDate : "1994-04-01",
			border : "white"
		},
		{
			name : "Legends",
			code : "LEG",
			releaseDate : "1994-06-01",
			border : "black"
		},
		{
			name : "The Dark",
			code : "DRK",
			releaseDate : "1994-08-01",
			border : "black"
		},
		{
			name : "Fallen Empires",
			code : "FEM",
			releaseDate : "1994-11-01",
			border : "black"
		},
		{
			name : "Fourth Edition",
			code : "4ED",
			releaseDate : "1995-04-01",
			border : "white"
		},
		{
			name : "Ice Age",
			code : "ICE",
			releaseDate : "1995-06-01",
			border : "black"
		},
		{
			name : "Homelands",
			code : "HML",
			releaseDate : "1995-10-01",
			border : "black"
		},
		{
			name : "Alliances",
			code : "ALL",
			releaseDate : "1996-06-10",
			border : "black"
		},
		{
			name : "Mirage",
			code : "MIR",
			releaseDate : "1996-10-08",
			border : "black"
		},
		{
			name : "Visions",
			code : "VIS",
			releaseDate : "1997-02-03",
			border : "black"
		},
		{
			name : "Fifth Edition",
			code : "5ED",
			releaseDate : "1997-03-24",
			border : "white"
		},
		{
			name : "Weatherlight",
			code : "WTH",
			releaseDate : "1997-06-09",
			border : "black"
		},
		{
			name : "Tempest",
			code : "TMP",
			releaseDate : "1997-10-14",
			border : "black"
		},
		{
			name : "Stronghold",
			code : "STH",
			releaseDate : "1998-03-02",
			border : "black"
		},
		{
			name : "Exodus",
			code : "EXO",
			releaseDate : "1998-06-15",
			border : "black"
		},
		{
			name : "Urza's Saga",
			code : "USG",
			releaseDate : "1998-10-12",
			border : "black"
		},
		{
			name : "Urza's Legacy",
			code : "ULG",
			releaseDate : "1999-02-15",
			border : "black"
		},
		{
			name : "Sixth Edition",
			code : "6ED",
			releaseDate : "1999-04-21",
			border : "white"
		},
		{
			name : "Urza's Destiny",
			code : "UDS",
			releaseDate : "1999-06-07",
			border : "black"
		},
		{
			name : "Mercadian Masques",
			code : "MMQ",
			releaseDate : "1999-10-04",
			border : "black"
		},
		{
			name : "Nemesis",
			code : "NMS",
			releaseDate : "2000-02-14",
			border : "black"
		},
		{
			name : "Prophecy",
			code : "PCY",
			releaseDate : "2000-06-05",
			border : "black"
		},
		{
			name : "Invasion",
			code : "INV",
			releaseDate : "2000-10-02",
			border : "black"
		},
		{
			name : "Planeshift",
			code : "PLS",
			releaseDate : "2001-02-05",
			border : "black"
		},
		{
			name : "Seventh Edition",
			code : "7ED",
			releaseDate : "2001-04-11",
			border : "white"
		},
		{
			name : "Apocalypse",
			code : "APC",
			releaseDate : "2001-06-04",
			border : "black"
		},
		{
			name : "Odyssey",
			code : "ODY",
			releaseDate : "2001-10-01",
			border : "black"
		},
		{
			name : "Torment",
			code : "TOR",
			releaseDate : "2002-02-04",
			border : "black"
		},
		{
			name : "Judgment",
			code : "JUD",
			releaseDate : "2002-05-27",
			border : "black"
		},
		{
			name : "Onslaught",
			code : "ONS",
			releaseDate : "2002-10-07",
			border : "black"
		},
		{
			name : "Legions",
			code : "LGN",
			releaseDate : "2003-02-03",
			border : "black"
		},
		{
			name : "Scourge",
			code : "SCG",
			releaseDate : "2003-05-26",
			border : "black"
		},
		{
			name : "Eighth Edition",
			code : "8ED",
			releaseDate : "2003-07-28",
			border : "white"
		},
		{
			name : "Mirrodin",
			code : "MRD",
			releaseDate : "2003-10-02",
			border : "black"
		},
		{
			name : "Darksteel",
			code : "DST",
			releaseDate : "2004-02-06",
			border : "black"
		},
		{
			name : "Fifth Dawn",
			code : "5DN",
			releaseDate : "2004-06-04",
			border : "black"
		},
		{
			name : "Champions of Kamigawa",
			code : "CHK",
			releaseDate : "2004-10-01",
			border : "black"
		},
		{
			name : "Betrayers of Kamigawa",
			code : "BOK",
			releaseDate : "2005-02-04",
			border : "black"
		},
		{
			name : "Saviors of Kamigawa",
			code : "SOK",
			releaseDate : "2005-06-03",
			border : "black"
		},
		{
			name : "Ninth Edition",
			code : "9ED",
			releaseDate : "2005-07-29",
			border : "white"
		},
		{
			name : "Ravnica: City of Guilds",
			code : "RAV",
			releaseDate : "2005-10-07",
			border : "black"
		},
		{
			name : "Guildpact",
			code : "GPT",
			releaseDate : "2006-02-03",
			border : "black"
		},
		{
			name : "Dissension",
			code : "DIS",
			releaseDate : "2006-05-05",
			border : "black"
		},
		{
			name : "Coldsnap",
			code : "CSP",
			releaseDate : "2006-07-21",
			border : "black"
		},
		{
			name : "Time Spiral",
			code : "TSP",
			releaseDate : "2006-10-06",
			border : "black"
		},
		{
			name : "Planar Chaos",
			code : "PLC",
			releaseDate : "2007-02-02",
			border : "black"
		},
		{
			name : "Future Sight",
			code : "FUT",
			releaseDate : "2007-05-04",
			border : "black"
		},
		{
			name : "Tenth Edition",
			code : "10E",
			releaseDate : "2007-07-13",
			border : "black"
		},
		{
			name : "Lorwyn",
			code : "LRW",
			releaseDate : "2007-10-12",
			border : "black"
		},
		{
			name : "Morningtide",
			code : "MOR",
			releaseDate : "2008-02-01",
			border : "black"
		},
		{
			name : "Shadowmoor",
			code : "SHM",
			releaseDate : "2008-05-02",
			border : "black"
		},
		{
			name : "Eventide",
			code : "EVE",
			releaseDate : "2008-07-25",
			border : "black"
		},
		{
			name : "Shards of Alara",
			code : "ALA",
			releaseDate : "2008-10-03",
			border : "black"
		},
		{
			name : "Conflux",
			code : "CON",
			releaseDate : "2009-02-06",
			border : "black"
		},
		{
			name : "Alara Reborn",
			code : "ARB",
			releaseDate : "2009-04-30",
			border : "black"
		},
		{
			name : "Magic 2010",
			code : "M10",
			releaseDate : "2009-07-17",
			border : "black"
		},
		{
			name : "Zendikar",
			code : "ZEN",
			releaseDate : "2009-10-02",
			border : "black"
		},
		{
			name : "Worldwake",
			code : "WWK",
			releaseDate : "2010-02-05",
			border : "black"
		},
		{
			name : "Rise of the Eldrazi",
			code : "ROE",
			releaseDate : "2010-04-23",
			border : "black"
		},
		{
			name : "Magic 2011",
			code : "M11",
			releaseDate : "2010-07-16",
			border : "black"
		},
		{
			name : "Scars of Mirrodin",
			code : "SOM",
			releaseDate : "2010-10-01",
			border : "black"
		},
		{
			name : "Mirrodin Besieged",
			code : "MBS",
			releaseDate : "2011-02-04",
			border : "black"
		},
		{
			name : "New Phyrexia",
			code : "NPH",
			releaseDate : "2011-05-13",
			border : "black"
		},
		{
			name : "Magic 2012",
			code : "M12",
			releaseDate : "2011-07-15",
			border : "black"
		},
		{
			name : "Innistrad",
			code : "ISD",
			releaseDate : "2011-09-30",
			border : "black"
		},
		{
			name : "Dark Ascension",
			code : "DKA",
			releaseDate : "2012-02-03",
			border : "black"
		},
		{
			name : "Avacyn Restored",
			code : "AVR",
			releaseDate : "2012-05-04",
			border : "black"
		},
		{
			name : "Magic 2013",
			code : "M13",
			releaseDate : "2012-07-13",
			border : "black"
		},
		{
			name : "Return to Ravnica",
			code : "RTR",
			releaseDate : "2012-10-05",
			border : "black"
		},
		{
			name : "Gatecrash",
			code : "GTC",
			releaseDate : "2013-02-01",
			border : "black"
		},
		{
			name : "Dragon's Maze",
			code : "DGM",
			releaseDate : "2013-05-03",
			border : "black"
		}
	];
})(typeof exports==="undefined" ? window.C={} : exports);
