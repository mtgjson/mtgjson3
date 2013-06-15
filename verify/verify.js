"use strict";
/*global Sizzle, Mousetrap: true*/
var $ = Sizzle;

var current = $("#cards tr:first-child")[0];
current.addClass("visible");

function showNext() { hide(); current = current.nextSibling || current; show(); }
function showPrevious() { hide(); current = current.previousSibling || current; show(); }
function showFirst() { hide(); current = $("#cards tr.card:first-child")[0]; show(); }
function showLast() { hide(); current = $("#cards tr.card:last-child")[0]; show(); }

function hide() { current.removeClass("visible"); }
function show() { current.addClass("visible"); }

Mousetrap.bind("left", showPrevious);
Mousetrap.bind("right", showNext);

Mousetrap.bind("home", showFirst);
Mousetrap.bind("end", showLast);
