"use strict";
/*global setImmediate: true*/

var base = require("xbase"),
	C = require("C"),
	cheerio = require("cheerio"),
	request = require("request"),
	fs = require("fs"),
	url = require("url"),
	moment = require("moment"),
	hash = require("mhash").hash,
	unicodeUtil = require("xutil").unicode,
	path = require("path"),
	urlUtil = require("xutil").url,
	querystring = require("querystring"),
	tiptoe = require("tiptoe");

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
		{ match : {name : "Nekrataal"}, replace : {hand : 0, artist : "Adrian Smith", flavor : "\"I have seen the horrors Kaervek has freed. My betrayal is certain - but of Kaervek or of Jamuraa, I cannot say.\" — Jolrael"}},
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
	"*" :
	[
		{ match : { name : "Draco" }, replace : {text : "Domain — Draco costs {2} less to cast for each basic land type among lands you control.\n\nFlying\n\nDomain — At the beginning of your upkeep, sacrifice Draco unless you pay {10}. This cost is reduced by {2} for each basic land type among lands you control."}},
		{ match : { name : "Spawnsire of Ulamog" }, replace : {text : "Annihilator 1 (Whenever this creature attacks, defending player sacrifices a permanent.)\n\n{4}: Put two 0/1 colorless Eldrazi Spawn creature tokens onto the battlefield. They have \"Sacrifice this creature: Add {1} to your mana pool.\"\n\n{20}: Cast any number of Eldrazi cards you own from outside the game without paying their mana costs."}},
		{ match : { name : "Jade Statue" }, remove : ["power", "toughness"] },
		{ match : { name : "Ghostfire" }, remove : ["colors"] }
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
	base.info("====================================================================================================================");
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
					output  : "checklist",
					sort    : "cn+",
					action  : "advanced",
					special : "true",
					set     : "[" + JSON.stringify(setName.replaceAll("&", "and")) + "]"
				}
			});

			listURL = listURL.replaceAll("%5C", "");

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
		function addLegalities()
		{
			base.info("Adding legalities to cards...");

			addLegalitiesToCards(this.data.set.cards, this);
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

			//base.info("Other Printings: %s", (this.data.set.cards.map(function(card) { return card.printings; }).flatten().unique().map(function(setName) { return C.SETS.mutateOnce(function(SET) { return SET.name===setName ? SET.code : undefined; }); }).remove(this.data.set.code) || []).join(" "));

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
				urls.forEach(function(multiverseURL)
				{
					getURLAsDoc(multiverseURL, this.parallel());
					getURLAsDoc(urlUtil.setQueryParam(multiverseURL, "printed", "true"), this.parallel());
				}.bind(this));
			},
			function processMultiverseDocs()
			{
				Array.prototype.slice.call(arguments).forEachBatch(function(multiverseDoc, printedMultiverseDoc)
				{
					var newCards = [];
					var multiverseDocCardParts = getCardParts(multiverseDoc);
					var printedMultiverseDocCardParts = getCardParts(printedMultiverseDoc);
					if(multiverseDocCardParts.length!==printedMultiverseDocCardParts.length)
					{
						throw new Error("multiverseDocCardParts length [" + multiverseDocCardParts.length + "] does not equal printedMultiverseDocCardParts length [" + printedMultiverseDocCardParts.length + "]");
					}

					multiverseDocCardParts.forEach(function(cardPart, i)
					{
						var newCard = processCardPart(multiverseDoc, cardPart, printedMultiverseDoc, printedMultiverseDocCardParts[i]);
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
				}, 2);

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

function processCardPart(doc, cardPart, printedDoc, printedCardPart)
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
	card.multiverseid = +querystring.parse(url.parse(cardPart.find(idPrefix + "_setRow .value a").attr("href")).query).multiverseid.trim();

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
	var rawTypeFull = cardPart.find(idPrefix + "_typeRow .value").text().trim();
	if(!rawTypeFull.contains("—") && rawTypeFull.contains(" - "))  // Some gatherer entries have a regular dash instead of a 'long dash'
	{
		base.warn("Raw type for card [%s] does not contain a long dash for type [%s] but does contain a small dash surrounded by spaces ' - '. Auto-correcting!", card.name, rawTypeFull);
		rawTypeFull = rawTypeFull.replace(" - ", "—");
	}
	var rawTypes = rawTypeFull.split(/[—]/);
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
		card.type += " — " + card.subtypes.join(" ");
	}
	if(!card.supertypes.length)
		delete card.supertypes;
	if(!card.types.length)
		delete card.types;

	if(card.types)
	{
		if(card.types.contains("Plane"))
			card.layout = "plane";
		else if(card.types.contains("Scheme"))
			card.layout = "scheme";
		else if(card.types.contains("Phenomenon"))
			card.layout = "phenomenon";
		else if(card.types.contains("Vanguard") && card.name.endsWith(" Avatar"))
			card.name = card.name.substring(0, (card.name.length-" Avatar".length));
	}

	// Original type
	card.originalType = printedCardPart.find(idPrefix + "_typeRow .value").text().trim().replaceAll(" -", " —");

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
		else if(card.types.contains("Vanguard"))
		{
			var handLifeParts = powerToughnessValue.trim().strip("+)(").replaceAll("Hand Modifier: ", "").replaceAll("Life Modifier: ", "").split(",").map(function(a) { return a.trim(); });
			if(handLifeParts.length!==2)
			{
				base.warn("Power toughness invalid [%s] for card: %s", cardPart.find(idPrefix + "_ptRow .value").text().trim(), card.name);
			}
			else
			{
				card.hand = parseInt(handLifeParts[0], 10);
				card.life = parseInt(handLifeParts[1], 10);
			}
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
	if(card.colors.length===0)
		delete card.colors;

	// Text
	var cardText = processTextBlocks(doc, cardPart.find(idPrefix + "_textRow .value .cardtextbox")).trim();
	if(cardText)
	{
		card.text = cardText;
		if(card.text.contains("{UNKNOWN}"))
			base.warn("Invalid symbol in oracle card text for card: %s", card.name);
	}

	// Original Printed Text
	var originalCardText = processTextBlocks(printedDoc, printedCardPart.find(idPrefix + "_textRow .value .cardtextbox")).trim();
	if(originalCardText)
	{
		card.originalText = originalCardText;
		if(card.originalText.contains("{UNKNOWN}"))
			base.warn("Invalid symbol in printed card text for card: %s", card.name);
	}

	// Flavor Text
	var cardFlavor = processTextBlocks(doc, cardPart.find(idPrefix + "_flavorRow .value .cardtextbox")).trim();
	if(cardFlavor)
		card.flavor = cardFlavor;

	// Card Number
	var cardNumberValue = cardPart.find(idPrefix + "_numberRow .value").text().trim();
	if(cardNumberValue)
	{
		if(card.layout==="split")
			cardNumberValue = cardNumberValue.replace(/[^\d.]/g, "") + ["a", "b"][card.names.indexOf(card.name)];
		
		card.number = cardNumberValue;
	}

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
			getURLAsDoc(buildMultiverseURL(multiverseid), this.parallel());
			getURLAsDoc(urlUtil.setQueryParam(buildMultiverseURL(multiverseid), "printed", "true"), this.parallel());
		},
		function processDefaultDoc(err, doc, printedDoc)
		{
			if(err)
				return setImmediate(function() { cb(err); });

			var urls = [];

			var cardParts = getCardParts(doc);
			var printedCardParts = getCardParts(printedDoc);
			if(cardParts.length!==printedCardParts.length)
				throw new Error("multiverseid [" + multiverseid + "] cardParts length [" + cardParts.length + "] does not equal printedCardParts length [" + printedCardParts.length + "]");

			cardParts.forEach(function(cardPart, i)
			{
				var card = processCardPart(doc, cardPart, printedDoc, printedCardParts[i]);
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

function getURLAsDoc(targetURL, cb)
{
	var urlHash = hash("whirlpool", targetURL);
	var cachePath = path.join(__dirname, "..", "cache", urlHash.charAt(0), urlHash);

	tiptoe(
		function get()
		{
			if(fs.existsSync(cachePath))
			{
				//base.info("URL [%s] is file: %s", url, cachePath);
				fs.readFile(cachePath, {encoding:"utf8"}, function(err, data) { this(null, null, data); }.bind(this));
			}
			else
			{
				base.info("Requesting from web: %s", targetURL);
				request(targetURL, this);
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

				if(card.layout==="normal" || (card.layout==="flip" && card.names && card.names.length>=1 && card.names[0]===card.name))
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

function addLegalitiesToCards(cards, cb)
{
	cards.serialForEach(function(card, subcb)
	{
		addLegalitiesToCard(card, subcb);
	}, cb);
}

function addLegalitiesToCard(card, cb)
{
	tiptoe(
		function getFirstPage()
		{
			getURLAsDoc(buildMultiverseLegalitiesURL(card.multiverseid), this);
		},
		function processLegalities(doc)
		{
			delete card.legalities;
			card.legalities = {};

			doc("table.cardList").map(function(i, item) { return doc(item); })[1].find("tr.cardItem").map(function(i, item) { return doc(item); }).forEach(function(cardRow)
			{
				var format = cardRow.find("td:nth-child(1)").text().trim();
				var legality = cardRow.find("td:nth-child(2)").text().trim();
				if(format && legality)
					card.legalities[format] = legality;
			});

			this();
		},
		function finish(err)
		{
			setImmediate(function() { cb(err); });
		}
	);
}

function buildMultiverseLegalitiesURL(multiverseid)
{
	var urlConfig = 
	{
		protocol : "http",
		host     : "gatherer.wizards.com",
		pathname : "/Pages/Card/Printings.aspx",
		query    : { multiverseid : multiverseid, page : "0" }
	};

	return url.format(urlConfig);
}

function addPrintingsToCards(cards, cb)
{
	cards.serialForEach(function(card, subcb)
	{
		addPrintingsToCard(card, subcb);
	}, cb);
}

function addPrintingsToCard(card, cb)
{
	tiptoe(
		function getFirstPage()
		{
			getURLAsDoc(buildMultiversePrintingsURL(card.multiverseid, 0), this);
		},
		function getAllPages(doc)
		{
			var pageLinks = doc("#ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_PrintingsList_pagingControlsContainer a").map(function(i, item) { return doc(item); });
			var numPages = pageLinks.length>0 ? pageLinks.length : 1;
			for(var i=0;i<numPages;i++)
			{
				getURLAsDoc(buildMultiversePrintingsURL(card.multiverseid, i), this.parallel());
			}
		},
		function processPrintings()
		{
			var docs = Array.prototype.slice.apply(arguments);

			var printings = [];
			docs.forEach(function(doc)
			{
				doc("table.cardList").map(function(i, item) { return doc(item); })[0].find("tr.cardItem").map(function(i, item) { return doc(item); }).forEach(function(cardRow)
				{
					var printing = cardRow.find("td:nth-child(3)").text().trim();
					if(printing)
						printings.push(printing);
				});
			});

			delete card.printings;

			printings = printings.unique().sort(function(a, b) { return moment(getReleaseDateForSet(a), "YYYY-MM-DD").unix()-moment(getReleaseDateForSet(b), "YYYY-MM-DD").unix(); });
			if(printings && printings.length)
				card.printings = printings;

			this();
		},
		function finish(err)
		{
			setImmediate(function() { cb(err); });
		}
	);
}

function buildMultiversePrintingsURL(multiverseid, page)
{
	var urlConfig = 
	{
		protocol : "http",
		host     : "gatherer.wizards.com",
		pathname : "/Pages/Card/Printings.aspx",
		query    : { multiverseid : multiverseid, page : ("" + (page || 0)) }
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

	// Planechase Planes
	"chaos"              : "C",
	"[chaos]"            : "C",

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
	"o5"  : "5",
	"o6"  : "6",
	"o7"  : "7",
	"o8"  : "8",
	"o9"  : "9"
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
				childText = childText.replaceAll("o" + text, "{" + symbol + "}");
				childText = childText.replaceAll(text, "{" + symbol + "}");
			});
			
			childText = childText.replaceAll("roll chaos", "roll {C}");
			childText = childText.replaceAll("chaos roll", "{C} roll");

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
