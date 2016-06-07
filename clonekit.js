'use strict';

// Clone kit

function clone_array(src, deep) {
	var result = [];
	var i, l = src.length;

	for (i = 0; i < l; i++) {
		if (deep)
			result.push(clone(src[i], deep));
		else
			result.push(src[i]);
	}

	return(result);
}

function clone_object(src, deep) {
	var result = {};

	Object.forEach(src, function(key, val) {
		if(deep)
			result[key] = clone(val, deep);
		else
			result[key] = val;
	});
	
	return(result);
}

function clone(src, deep) {
	return(Array.isArray(src) ? clone_array(src, deep) : (Object.isObject(src) ? clone_object(src, deep) : src));
}

// Globals
Array.prototype.clone = function(deep) {
	return(clone_array(this, deep));
}

Object.clone = clone_object;

module.exports = clone;
module.exports.object = clone_object;
module.exports.array = clone_array;
