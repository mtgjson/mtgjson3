"use strict";
/*global setImmediate: true*/

var base = require("base"),
	C = require("C"),
	cheerio = require("cheerio"),
	request = require("request"),
	fs = require("fs"),
	url = require("url"),
	moment = require("moment"),
	hash = require("mhash").hash,
	unicodeUtil = require("node-utils").unicode,
	path = require("path"),
	querystring = require("querystring"),
	tiptoe = require("tiptoe");

var GATHERER_NAME_CHANGES =
{
	"Commander" : "Magic: The Gathering-Commander"
};

var SET_CORRECTIONS =
{
	ARN :
	[
		{ match : {name: "Bazaar of Baghdad"}, replace : {artist : "Jeff A. Menges"} },
		{ match : {name: "Library of Alexandria"}, replace : {artist : "Mark Poole"} }
	],
	LEG :
	[
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
		{ renumberImages : "Forest", order : [4171, 4172, 4173, 4174] },
		{ renumberImages : "Island", order : [4199, 4200, 4201, 4202] },
		{ renumberImages : "Mountain", order : [4195, 4196, 4197, 4198] },
		{ renumberImages : "Plains", order : [4204, 4206, 4205, 4203] },
		{ renumberImages : "Swamp", order : [4169, 4168, 4167, 4170] }
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
		{ copyCard : "Budoka Pupil", replace :
			{
				name       : "Ichiga, Who Topples Oaks",
				number     : "122b",
				text       : "Trample\n\nRemove a ki counter from Ichiga, Who Topples Oaks: Target creature gets +2/+2 until end of turn.",
				type       : "Legendary Creature - Spirit",
				supertypes : ["Legendary"],
				types      : ["Creature"],
				subtypes   : ["Spirit"],
				power      : "4",
				toughness  : "4",
				imageName  : "ichiga, who topples oaks"
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
				type       : "Legendary Creature - Spirit",
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
		{ copyCard : "Cunning Bandit", replace :
			{
				name       : "Azamuki, Treachery Incarnate",
				number     : "99b",
				text       : "Remove a ki counter from Azamuki, Treachery Incarnate: Gain control of target creature until end of turn.",
				type       : "Legendary Creature - Spirit",
				supertypes : ["Legendary"],
				types      : ["Creature"],
				subtypes   : ["Spirit"],
				power      : "5",
				toughness  : "2",
				imageName  : "azamuki, treachery incarnate"
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
				type       : "Legendary Creature - Spirit",
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
	FUT :
	[
		{ match : {name : "Ghostfire"}, remove : ["colors"] }
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
		{ match : {name : "Our Market Research Shows That Players Like Really Long Card Names So We Made this Card to Have the Absolute Longest Card Name Ever Elemental"}, replace : {imageName : "our market research shows that players like really long card names so we made"}},
		{ match : {name : "Forest"}, replace : {border : "black"}},
		{ match : {name : "Island"}, replace : {border : "black"}},
		{ match : {name : "Mountain"}, replace : {border : "black"}},
		{ match : {name : "Plains"}, replace : {border : "black"}},
		{ match : {name : "Swamp"}, replace : {border : "black"}}
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
		{ match : {name : "Elephant"}, replace : {number : "T3", layout : "token"}}
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
	"*" :
	[
		{ match : { name : "Draco" }, replace : {text : "Domain — Draco costs {2} less to cast for each basic land type among lands you control.\n\nFlying\n\nDomain — At the beginning of your upkeep, sacrifice Draco unless you pay {10}. This cost is reduced by {2} for each basic land type among lands you control."}}
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

function cardComparator(a, b)
{
	var result = unicodeUtil.unicodeToAscii(a.name).toLowerCase().localeCompare(unicodeUtil.unicodeToAscii(b.name).toLowerCase());
	if(result!==0)
		return result;

	if(a.imageName && b.imageName)
		return a.imageName.localeCompare(b.imageName);

	if(a.hasOwnProperty("number"))
		return b.number.localeCompare(a.number);

	return 0;
}

function ripSet(setName, cb)
{
	base.info("================================================================");
	base.info("Ripping Set: %s", setName);

	tiptoe(
		function getListHTML()
		{
			base.info("Getting card list...");

			var listURL = url.format(
			{
				protocol : "http",
				host     : "gatherer.wizards.com",
				pathname : "/Pages/Search/Default.aspx",
				query    :
				{
					output : "checklist",
					sort   : "cn+",
					action : "advanced",
					set    : "[" + JSON.stringify((GATHERER_NAME_CHANGES[setName] || setName).replaceAll("&", "and")) + "]"
				}
			});

			getURLAsDoc(listURL, this);
		},
		function processFirstBatch(listDoc)
		{
			base.info("Processing first batch...");

			this.data.set = base.clone(C.SETS.mutateOnce(function(SET) { return SET.name===setName ? SET : undefined; }));

			processMultiverseids(listDoc("table.checklist tr.cardItem a.nameLink").map(function(i, itemRaw) { return +querystring.parse(url.parse(listDoc(itemRaw).attr("href")).query).multiverseid; }).unique(), this);
		},
		function processVariations(cards)
		{
			base.info("Processing variations...");

			this.data.set.cards = cards;
			processMultiverseids(cards.map(function(card) { return (card.variations && card.variations.length) ? card.variations : []; }).flatten().unique().subtract(cards.map(function(card) { return card.multiverseid; })), this);
		},
		function addAdditionalFields(cards)
		{
			base.info("Adding additional fields...");

			this.data.set.cards = this.data.set.cards.concat(cards).sort(cardComparator);

			// Image Name
			var cardNameCounts = {};
			this.data.set.cards.forEach(function(card)
			{
				if(!cardNameCounts.hasOwnProperty(card.name))
					cardNameCounts[card.name] = 0;
				else
					cardNameCounts[card.name]++;
			});

			Object.forEach(cardNameCounts, function(key, val)
			{
				if(val===0)
					delete cardNameCounts[key];
				else
					cardNameCounts[key]++;
			});

			var setCorrections = SET_CORRECTIONS["*"];
			if(SET_CORRECTIONS.hasOwnProperty(this.data.set.code))
				setCorrections = setCorrections.concat(SET_CORRECTIONS[this.data.set.code]);

			this.data.set.cards.forEach(function(card)
			{
				card.imageName = unicodeUtil.unicodeToAscii((card.layout==="split" ? card.names.join("") : card.name));

				if(cardNameCounts.hasOwnProperty(card.name))
				{
					var imageNumber = cardNameCounts[card.name]--;

					var numberOrder = setCorrections.mutateOnce(function(setCorrection) { return setCorrection.renumberImages===card.name ? setCorrection.order : undefined; });
					if(numberOrder)
						imageNumber = numberOrder.indexOf(card.multiverseid)+1;
					
					card.imageName += imageNumber;
				}

				card.imageName = card.imageName.replaceAll("/", " ");

				card.imageName = card.imageName.strip(":\"?").replaceAll(" token card", "").toLowerCase();
			});

			// Foreign Languages
			if(!fs.existsSync(path.join(__dirname, "..", "json", this.data.set.code + ".json")))
			{
				base.warn("SKIPPING foreign languages...");
				this();
			}
			else
			{
				base.info("Adding foreign languages to cards...");
				addForeignNamesToCards(this.data.set.cards, this);
			}
		},
		function addPrintings()
		{
			base.info("Adding printings to cards...");

			addPrintingsToCards(this.data.set.cards, this);
		},
		function finish(err)
		{
			if(err)
				return setImmediate(function() { cb(err); });

			base.info("Doing set corrections...");

			var setCorrections = SET_CORRECTIONS["*"];
			if(SET_CORRECTIONS.hasOwnProperty(this.data.set.code))
				setCorrections = setCorrections.concat(SET_CORRECTIONS[this.data.set.code]);

			// Set Corrections
			setCorrections.forEach(function(setCorrection)
			{
				this.data.set.cards.forEach(function(card)
				{
					if(setCorrection.match && Object.every(setCorrection.match, function(key, value) { return card[key]===value; }))
					{
						if(setCorrection.replace)
							Object.forEach(setCorrection.replace, function(key, value) { card[key] = value; });
						if(setCorrection.remove)
							setCorrection.remove.forEach(function(removeKey) { delete card[removeKey]; });
					}
				});

				if(setCorrection.copyCard)
				{
					var newCard = base.clone(this.data.set.cards.mutateOnce(function(card) { return card.name===setCorrection.copyCard ? card : undefined; }), true);
					if(setCorrection.replace)
						Object.forEach(setCorrection.replace, function(key, value) { newCard[key] = value; });

					this.data.set.cards.push(newCard);
				}
			}.bind(this));

			this.data.set.cards = this.data.set.cards.sort(cardComparator);

			// Warn about missing fields
			this.data.set.cards.forEach(function(card)
			{
				if(!card.rarity)
					base.warn("Rarity not found for card: %s", card.name);
				if(!card.artist)
					base.warn("Artist not found for card: %s", card.name);
			});

			setImmediate(function() { cb(err, this.data.set); }.bind(this));
		}
	);
}
exports.ripSet = ripSet;

function processMultiverseids(multiverseids, cb)
{
	var cards = [];
	var doubleFacedCardNames = [];

	base.info("Processing %d multiverseids", multiverseids.unique().length);

	multiverseids.unique().serialForEach(function(multiverseid, subcb)
	{
		tiptoe(
			function getMultiverseUrls()
			{
				getURLsForMultiverseid(multiverseid, this);
			},
			function getMultiverseDocs(urls)
			{
				urls.forEach(function(url)
				{
					getURLAsDoc(url, this.parallel());
				}.bind(this));
			},
			function processMultiverseDocs()
			{
				Array.prototype.slice.call(arguments).forEach(function(multiverseDoc)
				{
					var newCards = [];
					getCardParts(multiverseDoc).forEach(function(cardPart, i)
					{
						var newCard = processCardPart(multiverseDoc, cardPart);
						if(newCard.layout==="split" && i===1)
							return;

						newCards.push(newCard);
					});

					if(newCards.length===2 && newCards[0].layout==="double-faced")
					{
						var doubleFacedCardName = newCards[0].names.join(":::");
						if(!doubleFacedCardNames.contains(doubleFacedCardName))
							doubleFacedCardNames.push(doubleFacedCardName);
						else
							newCards = [];
					}

					cards = cards.concat(newCards);
				});

				this();
			},
			function finish(err) { setImmediate(function() { subcb(err); }); }
		);
	}, function(err) { return cb(err, cards); });
}

function getCardPartIDPrefix(cardPart)
{
	return "#" + cardPart.find(".rightCol").attr("id").replaceAll("_rightCol", "");
}

var POWER_TOUGHNESS_REPLACE_MAP =
{
	"{1/2}" : ".5",
	"{\\^2}"  : "²"
};

function processCardPart(doc, cardPart)
{
	var card =
	{
		layout     : "normal",
		supertypes : [],
		type       : "",
		types      : [],
		colors     : []
	};

	var idPrefix = getCardPartIDPrefix(cardPart);

	// Multiverseid
	card.multiverseid = +querystring.parse(url.parse(doc("#aspnetForm").attr("action")).query).multiverseid.trim();

	// Check for split card
	var fullCardName = doc("#ctl00_ctl00_ctl00_MainContent_SubContent_SubContentHeader_subtitleDisplay").text().trim();
	if(fullCardName.contains(" // "))
	{
		card.layout = "split";
		card.names = fullCardName.split(" // ").filter(function(splitName) { return splitName.trim(); });
	}

	// Check for flip or double-faced card
	var cardParts = getCardParts(doc);
	if(card.layout!=="split" && cardParts.length===2)
	{
		var firstCardText = processTextBlocks(doc, cardParts[0].find(getCardPartIDPrefix(cardParts[0]) + "_textRow .value .cardtextbox")).trim().toLowerCase();
		if(firstCardText.contains("flip"))
			card.layout = "flip";
		else if(firstCardText.contains("transform"))
			card.layout = "double-faced";
		else
			base.warn("Unknown card layout for multiverseid: %s", card.multiverseid);

		card.names = [cardParts[0].find(getCardPartIDPrefix(cardParts[0]) + "_nameRow .value").text().trim(), cardParts[1].find(getCardPartIDPrefix(cardParts[1]) + "_nameRow .value").text().trim()];
	}

	// Card Name
	card.name = cardPart.find(idPrefix + "_nameRow .value").text().trim();

	if(card.name.endsWith(" token card"))
		card.layout = "token";

	//base.info("Processing card: " + card.name);

	// Card Type
	var skipped = 0;
	var rawTypes = cardPart.find(idPrefix + "_typeRow .value").text().trim().split(/[—-]/);
	rawTypes[0].split(" ").filterEmpty().forEach(function(rawType, i)
	{
		if(rawType.trim().toLowerCase()==="(none)")
			return;

		card.type += ((i-skipped)>0 ? " " : "") + rawType;

		rawType = rawType.trim().toProperCase();
		if(C.SUPERTYPES.contains(rawType))
			card.supertypes.push(rawType);
		else if(C.TYPES.contains(rawType))
			card.types.push(rawType);
		else
			base.warn("Raw type not found [%s] for card: %s", rawType, card.name);
	});
	if(rawTypes.length>1)
	{
		card.subtypes = card.types.contains("Plane") ? [rawTypes[1].trim()] : rawTypes[1].split(" ").filterEmpty().map(function(subtype) { return subtype.trim(); });	// 205.3b Planes have just a single subtype
		card.type += " - " + card.subtypes.join(" ");
	}
	if(!card.supertypes.length)
		delete card.supertypes;
	if(!card.types.length)
		delete card.types;

	// Converted Mana Cost (CMC)
	var cardCMC = cardPart.find(idPrefix + "_cmcRow .value").text().trim();
	if(cardCMC)
		card.cmc = +cardCMC;

	// Rarity
	card.rarity = cardPart.find(idPrefix + "_rarityRow .value").text().trim();

	// Artist
	card.artist = cardPart.find(idPrefix + "_artistRow .value a").text().trim();

	// Power/Toughness or Loyalty
	var powerToughnessValue = cardPart.find(idPrefix + "_ptRow .value").text().trim();
	if(powerToughnessValue)
	{
		// Loyalty
		if(card.types.contains("Planeswalker"))
		{
			card.loyalty = +powerToughnessValue.trim();
		}
		else
		{
			// Power/Toughness
			Object.forEach(POWER_TOUGHNESS_REPLACE_MAP, function(find, replace)
			{
				powerToughnessValue = powerToughnessValue.replaceAll(find, replace);
			});

			var powerToughnessParts = powerToughnessValue.split("/");
			if(powerToughnessParts.length!==2)
			{
				base.warn("Power toughness invalid [%s] for card: %s", cardPart.find(idPrefix + "_ptRow .value").text().trim(), card.name);
			}
			else
			{
				card.power = powerToughnessParts[0].trim();
				card.toughness = powerToughnessParts[1].trim();
			}
		}
	}

	// Mana Cost
	var cardManaCosts = cardPart.find(idPrefix + "_manaRow .value img").map(function(i, item) { return doc(item); }).map(function(manaCost) { return processSymbol(manaCost.attr("alt")); });
	var cardManaCost = cardManaCosts.join("");
	if(cardManaCost)
		card.manaCost = cardManaCost;

	// Colors
	cardManaCosts.forEach(function(manaCost)
	{
		Object.forEach(COLOR_SYMBOL_TO_NAME_MAP, function(colorSymbol, colorName)
		{
			if(manaCost.contains(colorSymbol))
				card.colors.push(colorName);
		});
	});

	var cardColorIndicators = cardPart.find(idPrefix + "_colorIndicatorRow .value").text().trim().toLowerCase().split(",").map(function(cardColorIndicator) { return cardColorIndicator.trim(); }) || [];
	cardColorIndicators.forEach(function(cardColorIndicator)
	{
		if(cardColorIndicator && COLOR_ORDER.contains(cardColorIndicator))
			card.colors.push(cardColorIndicator);
	});

	card.colors = card.colors.unique().sort(function(a, b) { return COLOR_ORDER.indexOf(a)-COLOR_ORDER.indexOf(b); }).map(function(color) { return color.toProperCase(); });

	// Text
	var cardText = processTextBlocks(doc, cardPart.find(idPrefix + "_textRow .value .cardtextbox")).trim();
	if(cardText)
	{
		card.text = cardText;
		if(card.text.contains("{UNKNOWN}"))
			base.warn("Invalid symbol in card text for card: %s", card.name);
	}

	// Flavor Text
	var cardFlavor = processTextBlocks(doc, cardPart.find(idPrefix + "_flavorRow .value .cardtextbox")).trim();
	if(cardFlavor)
		card.flavor = cardFlavor;

	// Card Number
	var cardNumberValue = cardPart.find(idPrefix + "_numberRow .value").text().trim();
	if(cardNumberValue)
		card.number = cardNumberValue;

	// Watermark
	var cardWatermark = processTextBlocks(doc, cardPart.find(idPrefix + "_markRow .value .cardtextbox")).trim();
	if(cardWatermark)
		card.watermark = cardWatermark;

	// Rulings
	var rulingRows = cardPart.find(idPrefix + "_rulingsContainer table tr.post");
	if(rulingRows.length)
		card.rulings = rulingRows.map(function(i, item) { return doc(item); }).map(function(rulingRow) { return { date : moment(rulingRow.find("td:first-child").text().trim(), "MM/DD/YYYY").format("YYYY-MM-DD"), text : rulingRow.find("td:last-child").text().trim()}; });

	// Variations
	if(card.layout==="normal")
	{
		var variationLinks = cardPart.find(idPrefix + "_variationLinks a.variationLink").map(function(i, item) { return doc(item); });
		if(variationLinks.length)
			card.variations = variationLinks.map(function(variationLink) { return +variationLink.attr("id").trim(); }).filter(function(variation) { return variation!==card.multiverseid; });
	}

	return card;
}

function getCardParts(doc)
{
	return doc("table.cardDetails").map(function(i, item) { return doc(item); });
}

function getURLsForMultiverseid(multiverseid, cb)
{
	tiptoe(
		function getDefaultDoc()
		{
			getURLAsDoc(buildMultiverseURL(multiverseid), this);
		},
		function processDefaultDoc(err, doc)
		{
			if(err)
				return setImmediate(function() { cb(err); });

			var urls = [];
			getCardParts(doc).forEach(function(cardPart)
			{
				var card = processCardPart(doc, cardPart);
				if(card.layout==="split")
				{
					urls.push(buildMultiverseURL(multiverseid, card.names[0]));
					urls.push(buildMultiverseURL(multiverseid, card.names[1]));
				}
				else
				{
					urls.push(buildMultiverseURL(multiverseid));
				}
			});
			urls = urls.unique();

			setImmediate(function() { cb(null, urls); }.bind(this));
		}
	);
}

function buildMultiverseURL(multiverseid, part)
{
	var urlConfig = 
	{
		protocol : "http",
		host     : "gatherer.wizards.com",
		pathname : "/Pages/Card/Details.aspx",
		query    :
		{
			multiverseid : multiverseid,
			printed      : "false"
		}
	};
	if(part)
		urlConfig.query.part = part;

	return url.format(urlConfig);
}

function getURLAsDoc(url, cb)
{
	var urlHash = hash("whirlpool", url);
	var cachePath = path.join(__dirname, "..", "cache", urlHash.charAt(0), urlHash);

	tiptoe(
		function get()
		{
			if(fs.existsSync(cachePath))
			{
				fs.readFile(cachePath, {encoding:"utf8"}, function(err, data) { this(null, null, data); }.bind(this));
			}
			else
			{
				base.info("Requesting from web: %s", url);
				request(url, this);
			}
		},
		function createDoc(err, response, pageHTML)
		{
			if(err)
				return setImmediate(function() { cb(err); });

			if(!fs.existsSync(cachePath))
				fs.writeFileSync(cachePath, pageHTML, {encoding:"utf8"});

			setImmediate(function() { cb(null, cheerio.load(pageHTML)); }.bind(this));
		}
	);
}

function addForeignNamesToCards(cards, cb)
{
	var sets = {};

	tiptoe(
		function loadJSON()
		{
			C.SETS.forEach(function(SET)
			{
				fs.readFile(path.join(__dirname, "..", "json", SET.code + ".json"), {encoding : "utf8"}, this.parallel());
			}.bind(this));
		},
		function processCards()
		{
			var args=arguments;

			C.SETS.forEach(function(SET, i)
			{
				sets[SET.code] = JSON.parse(args[i]);
			});

			cards.serialForEach(function(card, subcb)
			{
				getForeignNamesForCardName(sets, card.name, subcb);
			}, this);
		},
		function applyForeignLanguages(err, cardsForeignNames)
		{
			if(err)
				return setImmediate(function() { cb(err); });

			cards.forEach(function(card, i)
			{
				delete card.foreignNames;

				if(card.layout==="normal")
				{
					var cardForeignNames = cardsForeignNames[i];
					if(cardForeignNames && cardForeignNames.length)
						card.foreignNames = cardForeignNames;
				}
			});

			setImmediate(function() { cb(); });
		}
	);
}

function getForeignNamesForCardName(sets, cardName, cb)
{
	var seenLanguages = [];
	var foreignLanguages = [];
	tiptoe(
		function fetchLanguagePages()
		{
			var multiverseids = getMultiverseidsForCardName(sets, cardName);
			multiverseids.serialForEach(function(multiverseid, subcb)
			{
				getURLAsDoc(buildMultiverseLanguagesURL(multiverseid), subcb);
			}, this);
		},
		function processDocs(err, docs)
		{
			if(err)
				return setImmediate(function() { cb(err); });

			docs.forEach(function(doc)
			{
				doc("table.cardList tr.cardItem").map(function(i, item) { return doc(item); }).forEach(function(cardRow)
				{
					var language = cardRow.find("td:nth-child(2)").text().trim();
					var foreignCardName = cardRow.find("td:nth-child(1) a").text().trim();
					if(language && foreignCardName && !seenLanguages.contains(language) && cardName!==foreignCardName)
					{
						seenLanguages.push(language);
						foreignLanguages.push({language : language, name : foreignCardName});
					}
				});
			});

			foreignLanguages = foreignLanguages.sort(function(a, b) { var al = a.language.toLowerCase().charAt(0); var bl = b.language.toLowerCase().charAt(0); return (al<bl ? -1 : (al>bl ? 1 : 0)); });

			setImmediate(function() { cb(null, foreignLanguages); });
		}
	);
}

function buildMultiverseLanguagesURL(multiverseid)
{
	var urlConfig = 
	{
		protocol : "http",
		host     : "gatherer.wizards.com",
		pathname : "/Pages/Card/Languages.aspx",
		query    : { multiverseid : multiverseid }
	};

	return url.format(urlConfig);
}

function addPrintingsToCards(cards, cb)
{
	tiptoe(
		function fetchPrintingsPages()
		{
			var args=arguments;

			cards.serialForEach(function(card, subcb)
			{
				getURLAsDoc(buildMultiversePrintingsURL(card.multiverseid), subcb);
			}, this);
		},
		function applyPrintings(err, docs)
		{
			if(err)
				return setImmediate(function() { cb(err); });

			cards.forEach(function(card, i)
			{
				var printings = [];
				var doc = docs[i];
				doc("table.cardList tr.cardItem").map(function(i, item) { return doc(item); }).forEach(function(cardRow)
				{
					var printing = cardRow.find("td:nth-child(3)").text().trim();
					if(printing)
						printings.push(printing);
				});

				delete card.printings;

				printings = printings.unique().sort(function(a, b) { return moment(getReleaseDateForSet(a), "YYYY-MM-DD").unix()-moment(getReleaseDateForSet(b), "YYYY-MM-DD").unix(); });
				if(printings && printings.length)
					card.printings = printings;
			});
			/*			docs.forEach(function(doc)
			{
				doc("table.cardList tr.cardItem").map(function(i, item) { return doc(item); }).forEach(function(cardRow)
				{
					var language = cardRow.find("td:nth-child(2)").text().trim();
					var foreignCardName = cardRow.find("td:nth-child(1) a").text().trim();
					if(language && foreignCardName && !seenLanguages.contains(language) && cardName!==foreignCardName)
					{
						seenLanguages.push(language);
						foreignLanguages.push({language : language, name : foreignCardName});
					}
				});
			});*/

			//foreignLanguages = foreignLanguages.sort(function(a, b) { var al = a.language.toLowerCase().charAt(0); var bl = b.language.toLowerCase().charAt(0); return (al<bl ? -1 : (al>bl ? 1 : 0)); });


			setImmediate(function() { cb(); });
		}
	);
}

function buildMultiversePrintingsURL(multiverseid)
{
	var urlConfig = 
	{
		protocol : "http",
		host     : "gatherer.wizards.com",
		pathname : "/Pages/Card/Printings.aspx",
		query    : { multiverseid : multiverseid }
	};

	return url.format(urlConfig);
}


function getMultiverseidsForCardName(sets, cardName)
{
	var multiverseids = [];

	Object.forEach(sets, function(setCode, set)
	{
		multiverseids = multiverseids.concat(set.cards.filter(function(card) { return card.name===cardName; }).map(function(card) { return card.multiverseid; }));
	});

	return multiverseids.unique();
}

exports.tmp = function(cb)
{
	var cards = [];
	tiptoe(
		function step1()
		{
			getURLsForMultiverseid(process.argv[2], this);
		},
		function step2(urls)
		{
			urls.forEach(function(url)
			{
				getURLAsDoc(url, this.parallel());
			}.bind(this));
		},
		function step3()
		{
			Array.prototype.slice.call(arguments).forEach(function(doc)
			{
				getCardParts(doc).forEach(function(cardPart)
				{
					var card = processCardPart(doc, cardPart);
					cards.push(card);
				});
			});

			addForeignNamesToCards(cards, this);
		},
		function step4()
		{
			addPrintingsToCards(cards, this);
		},
		function finish(err)
		{
			base.info(cards);
			setImmediate(function() { cb(err); });
		}
	);
};

var COLOR_ORDER = ["white", "blue", "black", "red", "green"];

var COLOR_SYMBOL_TO_NAME_MAP =
{
	"W" : "white",
	"U" : "blue",
	"B" : "black",
	"R" : "red",
	"G" : "green"
};

var SYMBOL_CONVERSION_MAP =
{
	"white"              : "W",
	"blue"               : "U",
	"black"              : "B",
	"red"                : "R",
	"green"              : "G",
	"zero"               : "0",
	"one"                : "1",
	"two"                : "2",
	"three"              : "3",
	"four"               : "4",
	"five"               : "5",
	"six"                : "6",
	"seven"              : "7",
	"eight"              : "8",
	"nine"               : "9",
	"ten"                : "10",
	"eleven"             : "11",
	"twelve"             : "12",
	"thirteen"           : "13",
	"fourteen"           : "14",
	"fifteen"            : "15",
	"sixteen"            : "16",
	"0"                  : "0",
	"1"                  : "1",
	"2"                  : "2",
	"3"                  : "3",
	"4"                  : "4",
	"5"                  : "5",
	"6"                  : "6",
	"7"                  : "7",
	"8"                  : "8",
	"9"                  : "9",
	"10"                 : "10",
	"11"                 : "11",
	"12"                 : "12",
	"13"                 : "13",
	"14"                 : "14",
	"15"                 : "15",
	"16"                 : "16",
	"tap"                : "T",
	"untap"              : "Q",
	"snow"               : "S",
	"phyrexian white"    : "P/W",
	"phyrexian blue"     : "P/U",
	"phyrexian black"    : "P/B",
	"phyrexian red"      : "P/R",
	"phyrexian green"    : "P/G",
	"phyrexian"          : "P",
	"variable colorless" : "X",

	// Unglued, Unhinged
	"100"                : "100",
	"500"                : "500",
	"1000000"            : "1000000",
	"infinite"           : "∞",
	"half a red"         : "hr"
};

var TEXT_TO_SYMBOL_MAP =
{
	"ocT" : "T",
	"oW"  : "W",
	"oU"  : "U",
	"oB"  : "B",
	"oR"  : "R",
	"oG"  : "G",
	"oX"  : "X",
	"o1"  : "1",
	"o2"  : "2",
	"o3"  : "3",
	"o4"  : "4",
	"o7"  : "7"
};

function processSymbol(symbol)
{
	var symbols = symbol.toLowerCase().split(" or ").map(function(symbolPart)
	{
		symbolPart = symbolPart.trim();
		if(!SYMBOL_CONVERSION_MAP.hasOwnProperty(symbolPart))
		{
			base.warn("Invalid symbolPart [%s] with full value: %s", symbolPart, symbol);
			return "UNKNOWN";
		}

		return SYMBOL_CONVERSION_MAP[symbolPart];
	});

	return "{" + (symbols.length>1 ? symbols.join("/") : symbols[0]) + "}";
}

function processTextBlocks(doc, textBlocks)
{
	var result = "";

	textBlocks.map(function(i, item) { return doc(item); }).forEach(function(textBox, i)
	{
		if(i>0)
			result += "\n\n";

		textBox.toArray().forEach(function(child)
		{
			result += processTextBoxChildren(doc, child.children);
		});
	});

	while(result.contains("\n\n\n"))
	{
		result = result.replaceAll("\n\n\n", "\n\n");
	}

	return result;
}

function processTextBoxChildren(doc, children)
{
	var result = "";

	children.forEach(function(child)
	{
		if(child.type==="tag")
		{
			if(child.name==="img")
				result += processSymbol(doc(child).attr("alt"));
			else if(child.name==="i")
			{
				result += processTextBoxChildren(doc, child.children);
			}
			else if(child.name==="<")
			{
				result += "<";
			}
			else if(child.name===">")
			{
				result += ">";
			}
			else
				base.warn("Unsupported text child tag name %s", child.name);
		}
		else if(child.type==="text")
		{
			var childText = child.data;
			Object.forEach(TEXT_TO_SYMBOL_MAP, function(text, symbol)
			{
				childText = childText.replaceAll(text, "{" + symbol + "}");
			});
			result += childText;
		}
		else
		{
			base.warn("Unknown text child type: %s", child.type);
		}
	});

	return result;
}

function getReleaseDateForSet(setName)
{
	return C.SETS.mutateOnce(function(SET) { return SET.name===setName ? SET.releaseDate : undefined; }) || moment().format("YYYY-MM-DD");
}
