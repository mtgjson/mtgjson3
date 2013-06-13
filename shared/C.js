"use strict";

(function(exports)
{
    var isNode = typeof process!=="undefined" && typeof process.versions!=="undefined" && typeof process.versions.node!=="undefined";
    var base = isNode ? require("node-base") : window.base;

	exports.SUPERTYPES = ["Basic", "Legendary", "Snow", "World"];
	exports.TYPES = ["Instant", "Sorcery", "Artifact", "Creature", "Enchantment", "Land", "Planeswalker", "Tribal", "Plane", "Phenomenon", "Scheme", "Vanguard"];
})(typeof exports==="undefined" ? window.C={} : exports);
