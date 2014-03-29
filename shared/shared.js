"use strict";
/*global setImmediate: true*/

var base = require("xbase"),
	C = require("C"),
	url = require("url"),
	unicodeUtil = require("xutil").unicode;

exports.getSetsToDo = function(startAt)
{
	startAt = startAt || 2;
	if(process.argv.length<(startAt+1))
	{
		base.error("Usage: node %s <set code|'allsets'>", process.argv[1]);
		process.exit(1);
	}

	var setsNotToDo = [];
	var setsToDo = [];

	process.argv.slice(startAt).forEach(function(arg)
	{
		if(arg==="allsets")
		{
			setsToDo = C.SETS.map(function(SET) { return SET.code; });
		}
		else if(arg.toLowerCase().startsWith("startat"))
		{
			setsToDo = C.SETS.map(function(SET) { return SET.code; });
			setsToDo = setsToDo.slice(setsToDo.indexOf(arg.substring("startat".length)));
		}
		else if(arg.toLowerCase().startsWith("not"))
		{
			setsNotToDo.push(arg);
			setsNotToDo.push(arg.substring(3));
		}
		else
		{
			setsToDo.push(arg);
		}
	});

	setsToDo.removeAll(setsNotToDo);

	return setsToDo.uniqueBySort();
};

exports.cardComparator = function(a, b)
{
	var result = unicodeUtil.unicodeToAscii(a.name).toLowerCase().localeCompare(unicodeUtil.unicodeToAscii(b.name).toLowerCase());
	if(result!==0)
		return result;

	if(a.imageName && b.imageName)
		return a.imageName.localeCompare(b.imageName);

	if(a.hasOwnProperty("number"))
		return b.number.localeCompare(a.number);

	return 0;
};


exports.buildMultiverseLanguagesURL = function(multiverseid)
{
	var urlConfig = 
	{
		protocol : "http",
		host     : "gatherer.wizards.com",
		pathname : "/Pages/Card/Languages.aspx",
		query    : { multiverseid : multiverseid }
	};

	return url.format(urlConfig);
};


exports.buildMultiverseURL = function(multiverseid, part)
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
};


exports.buildMultiverseLegalitiesURL = function(multiverseid)
{
	var urlConfig = 
	{
		protocol : "http",
		host     : "gatherer.wizards.com",
		pathname : "/Pages/Card/Printings.aspx",
		query    : { multiverseid : multiverseid, page : "0" }
	};

	return url.format(urlConfig);
};

exports.buildMultiversePrintingsURL = function(multiverseid, page)
{
	var urlConfig = 
	{
		protocol : "http",
		host     : "gatherer.wizards.com",
		pathname : "/Pages/Card/Printings.aspx",
		query    : { multiverseid : multiverseid, page : ("" + (page || 0)) }
	};

	return url.format(urlConfig);
};
