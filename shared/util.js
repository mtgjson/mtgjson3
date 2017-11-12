"use strict";

exports.uniqueFilter = function(value, index, self) {
    return self.indexOf(value) === index;
}
