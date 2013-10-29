package com.mtgjson;

import java.util.ArrayList;

public class MTGCard
{
	private String				layout;
	private String				name;
	private ArrayList<String>	names;
	private String				manaCost;	
	private Integer				cmc;
	private ArrayList<String>	colors;
	private String				type;
	private ArrayList<String>	supertypes;
	private ArrayList<String>	types;
	private ArrayList<String>	subtypes;
	private String				rarity;
	private String				text;
	private String				flavor;
	private String				artist;
	private String				number;
	private String				power;
	private String				toughness;
	private Integer				loyalty;
	private Integer				multiverseid;
	private ArrayList<String>	variations;
	private String				imageName;
	private String				border;
	private String				watermark;
	
	// Not part of JSON, will be set later
	private String				setCode;
	private String				setName;
	
	public String getLayout()
	{
		return layout;
	}
	public void setLayout(String layout)
	{
		this.layout = layout;
	}
	public String getName()
	{
		return name;
	}
	public void setName(String name)
	{
		this.name = name;
	}
	public ArrayList<String> getNames()
	{
		return names;
	}
	public void setNames(ArrayList<String> names)
	{
		this.names = names;
	}
	public String getManaCost()
	{
		return manaCost;
	}
	public void setManaCost(String manaCost)
	{
		this.manaCost = manaCost;
	}
	public Integer getCmc()
	{
		return cmc;
	}
	public void setCmc(Integer cmc)
	{
		this.cmc = cmc;
	}
	public ArrayList<String> getColors()
	{
		return colors;
	}
	public void setColors(ArrayList<String> colors)
	{
		this.colors = colors;
	}
	public String getType()
	{
		return type;
	}
	public void setType(String type)
	{
		this.type = type;
	}
	public ArrayList<String> getSupertypes()
	{
		return supertypes;
	}
	public void setSupertypes(ArrayList<String> supertypes)
	{
		this.supertypes = supertypes;
	}
	public ArrayList<String> getTypes()
	{
		return types;
	}
	public void setTypes(ArrayList<String> types)
	{
		this.types = types;
	}
	public ArrayList<String> getSubtypes()
	{
		return subtypes;
	}
	public void setSubtypes(ArrayList<String> subtypes)
	{
		this.subtypes = subtypes;
	}
	public String getRarity()
	{
		return rarity;
	}
	public void setRarity(String rarity)
	{
		this.rarity = rarity;
	}
	public String getText()
	{
		return text;
	}
	public void setText(String text)
	{
		this.text = text;
	}
	public String getFlavor()
	{
		return flavor;
	}
	public void setFlavor(String flavor)
	{
		this.flavor = flavor;
	}
	public String getArtist()
	{
		return artist;
	}
	public void setArtist(String artist)
	{
		this.artist = artist;
	}
	public String getNumber()
	{
		return number;
	}
	public void setNumber(String number)
	{
		this.number = number;
	}
	public String getPower()
	{
		return power;
	}
	public void setPower(String power)
	{
		this.power = power;
	}
	public String getToughness()
	{
		return toughness;
	}
	public void setToughness(String toughness)
	{
		this.toughness = toughness;
	}
	public Integer getLoyalty()
	{
		return loyalty;
	}
	public void setLoyalty(Integer loyalty)
	{
		this.loyalty = loyalty;
	}
	public Integer getMultiverseid()
	{
		return multiverseid;
	}
	public void setMultiverseid(Integer multiverseid)
	{
		this.multiverseid = multiverseid;
	}
	public ArrayList<String> getVariations()
	{
		return variations;
	}
	public void setVariations(ArrayList<String> variations)
	{
		this.variations = variations;
	}
	public String getImageName()
	{
		return imageName;
	}
	public void setImageName(String imageName)
	{
		this.imageName = imageName;
	}
	public String getBorder()
	{
		return border;
	}
	public void setBorder(String border)
	{
		this.border = border;
	}
	public String getWatermark()
	{
		return watermark;
	}
	public void setWatermark(String watermark)
	{
		this.watermark = watermark;
	}
	public String getSetName()
	{
		return setName;
	}
	public void setSetName(String setName)
	{
		this.setName = setName;
	}
	public String getSetCode()
	{
		return setCode;
	}
	public void setSetCode(String setCode)
	{
		this.setCode = setCode;
	}
}
