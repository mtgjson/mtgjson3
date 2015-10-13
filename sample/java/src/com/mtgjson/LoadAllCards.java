package com.mtgjson;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class LoadAllCards
{
	public static void main(String[] args) throws JsonParseException, JsonMappingException, IOException
	{
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		@SuppressWarnings("unchecked")
		List<MTGCard> allCards = getAllCards((Map<String, MTGSet>)mapper.readValue(new File("AllSets.json"), new TypeReference<Map<String, MTGSet>>()  {}));
		
		System.out.println("Number of cards: " + allCards.size());
	}
	
	public static List<MTGCard> getAllCards(Map<String, MTGSet> sets)
	{
		List<MTGCard> allCards = new ArrayList<MTGCard>();
		
		for(MTGSet set : sets.values())
		{
			for(MTGCard card : set.getCards())
			{
				//card.setSetCode(set.getCode());
				//card.setSetName(set.getName());
				//System.out.println(set.getName() + ": " + card.getName());
				
				allCards.add(card);
			}
		}
		
		return allCards;
	}
}



