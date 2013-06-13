"use strict";
/*global setImmediate: true*/

var base = require("node-base"),
	C = require("C"),
	cheerio = require("cheerio"),
	request = require("request"),
	fs = require("fs"),
	url = require("url"),
	path = require("path"),
	querystring = require("querystring"),
	tiptoe = require("tiptoe");

function ripCards(setName, cb)
{
	tiptoe(
		function getListHTML()
		{
			var listURL = url.format(
			{
				protocol : "http",
				host     : "gatherer.wizards.com",
				pathname : "/Pages/Search/Default.aspx",
				query    :
				{
					output : "checklist",
					sort   : "cn+",
					set    : "[" + JSON.stringify("Arabian Nights") + "]"
				}
			});

			request(listURL, this);
		},
		function parseListPage(response, listHTML)
		{
			var listDoc = cheerio.load(listHTML);

			var multiverseids = listDoc("table.checklist tr.cardItem a.nameLink").map(function(i, itemRaw) { return +querystring.parse(url.parse(listDoc(itemRaw).attr("href")).query).multiverseid; }).unique();
			this.data.multiverseids = [];

			multiverseids = [915, 970];	// TEMPORARY

			multiverseids.serialForEach(function(multiverseid, subcb)
			{
				tiptoe(
					function getCard()
					{
						ripCard(multiverseid, this);
					},
					function processCard(err, card)
					{
						if(err || !card)
						{
							setImmediate(function() { subcb(err || new Error("Invalid card response")); });
							return;
						}

						base.info(card);

						this.data.multiverseids.push(card.multiverseid);
						if(card.variationids && card.variationids.length)
							this.data.multiverseids.concat(card.variationids);

						setImmediate(subcb);
					}.bind(this)
				);
			}.bind(this), this);
		},
		function finish(err)
		{
			if(err)
				setImmediate(function() { cb(err); });
			else
				setImmediate(function() { cb(err, this.data.multiverseids); }.bind(this));
		}
	);
}
exports.cards = ripCards;

function processCardPart(cardPart, cb)
{
	/*

			var card = {
				multiverseid : multiverseid,
				supertypes   : [],
				types        : []
			};

			// Get our card types
			var rawTypes = cardDoc("div#ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_typeRow div.value").text().trim().split("—");
			rawTypes[0].split(" ").filterEmpty().forEach(function(rawType)
			{
				rawType = rawType.trim().toProperCase();
				if(C.SUPERTYPES.contains(rawType))
					card.supertypes.push(rawType);
				else if(C.TYPES.contains(rawType))
					card.types.push(rawType);
				else
					base.warn("Raw type not found: %s", rawType);
			});
			if(rawTypes.length>1)
				card.subtypes = card.types.contains("Plane") ? [rawTypes[1].trim()] : rawTypes[1].split(" ").filterEmpty().map(function(subtype) { return subtype.trim(); });	// 205.3b Planes have just a single subtype

			*/
		
}

function getCardParts(pageDoc, cb)
{

}

function getVariationIds(pageDoc, cb)
{

}

function getDoc(multiverseid, cb)
{
	tiptoe(
		function getHTML()
		{
			var pageURL = url.format(
			{
				protocol : "http",
				host     : "gatherer.wizards.com",
				pathname : "/Pages/Card/Details.aspx",
				query    :
				{
					multiverseid : multiverseid,
					printed      : "false"
				}
			});

			if(fs.existsSync(path.join("/", "tmp", multiverseid + ".html")))
				fs.readFile(path.join("/", "tmp", multiverseid + ".html"), {encoding:"utf8"}, function(err, data) { this(null, null, data); }.bind(this));
			else
				request(pageURL, this);
		},
		function createDoc(err, response, pageHTML)
		{
			if(err)
			{
				setImmediate(function() { cb(err); });
				return;
			}

			if(!fs.existsSync(path.join("/", "tmp", multiverseid + ".html")))
				fs.writeFileSync(path.join("/", "tmp", multiverseid + ".html"), pageHTML, {encoding:"utf8"});

			setImmediate(function() { cb(null, cheerio.load(pageHTML)); }.bind(this));
		}
	);
}











			/*
			String cardType = xpathText(root, "//html:div[@id='ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_typeRow']/html:div[@class='value']", nsMap);
		if(cardType.startsWith("Basic Land"))
		{
			log.info("Skipping " + cardType);
			return false;
		}
		
		String switchLinkText = XMLUtilities.xpathSelectAll(root, "//html:a[@id='cardTextSwitchLink1']", nsMap).get(0).attributeValue("href");
		cardDetails.put("multiverseid", switchLinkText.substring(switchLinkText.indexOf("multiverseid=")+("multiverseid=".length())));
		
		cardDetails.put("name", xpathText(root, "//html:div[@id='ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_nameRow']/html:div[@class='value']", nsMap));
		cardDetails.put("cmc", xpathText(root, "//html:div[@id='ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_cmcRow']/html:div[@class='value']", nsMap));
		cardDetails.put("type", cardType);
		cardDetails.put("text", processCardTextElements(XMLUtilities.xpathSelectAll(root, "//html:div[@id='ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_textRow']/html:div[@class='value']/html:div[@class='cardtextbox']", nsMap)));

		cardDetails.put("flavor", processCardTextElements(XMLUtilities.xpathSelectAll(root, "//html:div[@id='ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_FlavorText']/html:div[@class='cardtextbox']", nsMap)));
		
		cardDetails.put("power", "");
		cardDetails.put("toughness", "");
		String powerToughness = xpathText(root, "//html:div[@id='ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_ptRow']/html:div[@class='value']", nsMap);
		if(powerToughness.contains("/"))
		{
			String[] powerToughnessArray = powerToughness.split("/");
			if(powerToughnessArray.length==2)
			{
				cardDetails.put("power", powerToughnessArray[0].trim());
				cardDetails.put("toughness", powerToughnessArray[1].trim());
			}
		}
		
		cardDetails.put("cardNumber", xpathText(root, "//html:div[@id='ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_numberRow']/html:div[@class='value']", nsMap));
		cardDetails.put("rarity", xpathText(root, "//html:div[@id='ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_rarityRow']/html:div[@class='value']/html:span", nsMap));
		cardDetails.put("artist", xpathText(root, "//html:div[@id='ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_ArtistCredit']/html:a", nsMap));
		
		StringBuilder manaCost = new StringBuilder("");
		List<Element> manaElements = XMLUtilities.xpathSelectAll(root, "//html:div[@id='ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_manaRow']/html:div[@class='value']/html:img", nsMap);
		for(Element manaElement : manaElements)
		{
			manaCost.append(processManaElement(manaElement, false));
		}
		cardDetails.put("manaCost", manaCost.toString());
		
		// rulings
		List<Element> rulingElements = XMLUtilities.xpathSelectAll(root, "//html:tr[contains(@class, 'post')]", nsMap);
		for(Element rulingElement : rulingElements)
		{
			List<Element> rulingElementColumns = XMLUtilities.xpathSelectAll(rulingElement, "html:td", nsMap);
			if(rulingElementColumns.size()!=2)
			{
				log.warn("Don't have expected number of ruling elements. Expected 2, got [" + rulingElementColumns.size() + "]");
				continue;
			}
			
			Map<String, String> ruling = new HashMap<String, String>();
			ruling.put("date", rulingElementColumns.get(0).getTextTrim());
			ruling.put("text", rulingElementColumns.get(1).getTextTrim());
			
			cardRulings.add(ruling);
		}
		
		cardDetails.put("loyalty", xpathText(root, "//html:div[@id='ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_ptRow']/html:div[@class='label'][contains(text(), 'Loyalty')]/../html:div[@class='value']", nsMap));
		
		ProcessUtilities.generateKey(cardDetails);

		log.info(cardDetails.get("name") + " " + cardDetails.get("manaCost") + "\t\t\t" + cardDetails.get("type") + ": " + StringUtilities.innerTrim(cardDetails.get("text")));
			 */
			