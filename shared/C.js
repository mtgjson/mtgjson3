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
			releaseDate : "1993-08-05"
		},
		{
			name : "Limited Edition Beta",
			code : "LEB",
			releaseDate : "1993-10-01"
		},
		{
			name : "Arabian Nights",
			code : "ARN",
			releaseDate : "1993-12-01"
		},
		{
			name : "Unlimited Edition",
			code : "2ED",
			releaseDate : "1993-12-01"
		},
		{
			name : "Antiquities",
			code : "ATQ",
			releaseDate : "1994-03-01"
		},
		{
			name : "Revised Edition",
			code : "3ED",
			releaseDate : "1994-04-01"
		},
		{
			name : "Legends",
			code : "LEG",
			releaseDate : "1994-06-01"
		},
		{
			name : "The Dark",
			code : "DRK",
			releaseDate : "1994-08-01"
		},
		{
			name : "Fallen Empires",
			code : "FEM",
			releaseDate : "1994-11-01"
		},
		{
			name : "Fourth Edition",
			code : "4ED",
			releaseDate : "1995-04-01"
		},
		{
			name : "Ice Age",
			code : "ICE",
			releaseDate : "1995-06-01"
		},
		{
			name : "Homelands",
			code : "HML",
			releaseDate : "1995-10-01"
		},
		{
			name : "Alliances",
			code : "ALL",
			releaseDate : "1996-06-10"
		},
		{
			name : "Mirage",
			code : "MIR",
			releaseDate : "1996-10-08"
		},
		{
			name : "Visions",
			code : "VIS",
			releaseDate : "1997-02-03"
		},
		{
			name : "Fifth Edition",
			code : "5ED",
			releaseDate : "1997-03-24"
		},
		{
			name : "Weatherlight",
			code : "WTH",
			releaseDate : "1997-06-09"
		},
		{
			name : "Tempest",
			code : "TMP",
			releaseDate : "1997-10-14"
		},
		{
			name : "Stronghold",
			code : "STH",
			releaseDate : "1998-03-02"
		},
		{
			name : "Exodus",
			code : "EXO",
			releaseDate : "1998-06-15"
		},
		{
			name : "Urza's Saga",
			code : "USG",
			releaseDate : "1998-10-12"
		},
		{
			name : "Urza's Legacy",
			code : "ULG",
			releaseDate : "1999-02-15"
		},
		{
			name : "Sixth Edition",
			code : "6ED",
			releaseDate : "1999-04-21"
		},
		{
			name : "Urza's Destiny",
			code : "UDS",
			releaseDate : "1999-06-07"
		},
		{
			name : "Mercadian Masques",
			code : "MMQ",
			releaseDate : "1999-10-04"
		},
		{
			name : "Nemesis",
			code : "NMS",
			releaseDate : "2000-02-14"
		},
		{
			name : "Prophecy",
			code : "PCY",
			releaseDate : "2000-06-05"
		},
		{
			name : "Invasion",
			code : "INV",
			releaseDate : "2000-10-02"
		},
		{
			name : "Planeshift",
			code : "PLS",
			releaseDate : "2001-02-05"
		},
		{
			name : "Seventh Edition",
			code : "7ED",
			releaseDate : "2001-04-11"
		},
		{
			name : "Apocalypse",
			code : "APC",
			releaseDate : "2001-06-04"
		},
		{
			name : "Odyssey",
			code : "ODY",
			releaseDate : "2001-10-01"
		},
		{
			name : "Torment",
			code : "TOR",
			releaseDate : "2002-02-04"
		},
		{
			name : "Judgment",
			code : "JUD",
			releaseDate : "2002-05-27"
		},
		{
			name : "Onslaught",
			code : "ONS",
			releaseDate : "2002-10-07"
		},
		{
			name : "Legions",
			code : "LGN",
			releaseDate : "2003-02-03"
		},
		{
			name : "Scourge",
			code : "SCG",
			releaseDate : "2003-05-26"
		},
		{
			name : "Eighth Edition",
			code : "8ED",
			releaseDate : "2003-07-28"
		},
		{
			name : "Mirrodin",
			code : "MRD",
			releaseDate : "2003-10-02"
		},
		{
			name : "Darksteel",
			code : "DST",
			releaseDate : "2004-02-06"
		},
		{
			name : "Fifth Dawn",
			code : "5DN",
			releaseDate : "2004-06-04"
		},
		{
			name : "Champions of Kamigawa",
			code : "CHK",
			releaseDate : "2004-10-01"
		},
		{
			name : "Betrayers of Kamigawa",
			code : "BOK",
			releaseDate : "2005-02-04"
		},
		{
			name : "Saviors of Kamigawa",
			code : "SOK",
			releaseDate : "2005-06-03"
		},
		{
			name : "Ninth Edition",
			code : "9ED",
			releaseDate : "2005-07-29"
		},
		{
			name : "Ravnica: City of Guilds",
			code : "RAV",
			releaseDate : "2005-10-07"
		},
		{
			name : "Guildpact",
			code : "GPT",
			releaseDate : "2006-02-03"
		},
		{
			name : "Dissension",
			code : "DIS",
			releaseDate : "2006-05-05"
		},
		{
			name : "Coldsnap",
			code : "CSP",
			releaseDate : "2006-07-21"
		},
		{
			name : "Time Spiral",
			code : "TSP/TSB",
			releaseDate : "2006-10-06"
		},
		{
			name : "Planar Chaos",
			code : "PLC",
			releaseDate : "2007-02-02"
		},
		{
			name : "Future Sight",
			code : "FUT",
			releaseDate : "2007-05-04"
		},
		{
			name : "Tenth Edition",
			code : "10E",
			releaseDate : "2007-07-13"
		},
		{
			name : "Lorwyn",
			code : "LRW",
			releaseDate : "2007-10-12"
		},
		{
			name : "Morningtide",
			code : "MOR",
			releaseDate : "2008-02-01"
		},
		{
			name : "Shadowmoor",
			code : "SHM",
			releaseDate : "2008-05-02"
		},
		{
			name : "Eventide",
			code : "EVE",
			releaseDate : "2008-07-25"
		},
		{
			name : "Shards of Alara",
			code : "ALA",
			releaseDate : "2008-10-03"
		},
		{
			name : "Conflux",
			code : "CON",
			releaseDate : "2009-02-06"
		},
		{
			name : "Alara Reborn",
			code : "ARB",
			releaseDate : "2009-04-30"
		},
		{
			name : "Magic 2010",
			code : "M10",
			releaseDate : "2009-07-17"
		},
		{
			name : "Zendikar",
			code : "ZEN",
			releaseDate : "2009-10-02"
		},
		{
			name : "Worldwake",
			code : "WWK",
			releaseDate : "2010-02-05"
		},
		{
			name : "Rise of the Eldrazi",
			code : "ROE",
			releaseDate : "2010-04-23"
		},
		{
			name : "Magic 2011",
			code : "M11",
			releaseDate : "2010-07-16"
		},
		{
			name : "Scars of Mirrodin",
			code : "SOM",
			releaseDate : "2010-10-01"
		},
		{
			name : "Mirrodin Besieged",
			code : "MBS",
			releaseDate : "2011-02-04"
		},
		{
			name : "New Phyrexia",
			code : "NPH",
			releaseDate : "2011-05-13"
		},
		{
			name : "Magic 2012",
			code : "M12",
			releaseDate : "2011-07-15"
		},
		{
			name : "Innistrad",
			code : "ISD",
			releaseDate : "2011-09-30"
		},
		{
			name : "Dark Ascension",
			code : "DKA",
			releaseDate : "2012-02-03"
		},
		{
			name : "Avacyn Restored",
			code : "AVR",
			releaseDate : "2012-05-04"
		},
		{
			name : "Magic 2013",
			code : "M13",
			releaseDate : "2012-07-13"
		},
		{
			name : "Return to Ravnica",
			code : "RTR",
			releaseDate : "2012-10-05"
		},
		{
			name : "Gatecrash",
			code : "GTC",
			releaseDate : "2013-02-01"
		},
		{
			name : "Dragon's Maze",
			code : "DGM",
			releaseDate : "2013-05-03"
		}
	];
})(typeof exports==="undefined" ? window.C={} : exports);
