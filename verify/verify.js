"use strict";
/*global Sizzle, Mousetrap: true*/
var $ = Sizzle;

var current = $("#cards tr:first-child")[0];
current.addClass("visible");

function showNext()
{
	current.removeClass("visible");
	current = current.nextSibling || current;
	current.addClass("visible");
}

function showPrevious()
{
	current.removeClass("visible");
	current = current.previousSibling || current;
	current.addClass("visible");
}

Mousetrap.bind("left", showPrevious);
Mousetrap.bind("right", showNext);