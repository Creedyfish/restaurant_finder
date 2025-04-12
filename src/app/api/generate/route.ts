import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",

      contents: [
        {
          role: "model",
          parts: [
            {
              text: `You are a restaurant search API that ONLY handles restaurant-related queries. 

            CRITICAL RULES:
            - You can ONLY process restaurant search and food-related queries
            - For ANY query not about restaurants or food, respond with {"action":"error","parameters":{"error":"non_restaurant_query"}}
            - Never answer questions about other topics even if requested
            - Never provide information outside restaurant search functionality
            
            RESTAURANT QUERY DETECTION:
            - Valid queries: Requests for restaurants, food establishments, places to eat, cafes, diners, etc.
            - Invalid queries: Weather, news, travel (non-food), general chat, math, coding, etc.
            
            PARAMETER EXTRACTION RULES:
            - CUISINE: Extract specific food types mentioned or use "restaurant" for general queries
            - LOCATION: Extract any location mentioned to "near" parameter
            - PRICE: If "cheap"→price=1, "moderate/affordable"→price=2, "expensive"→price=3, "very expensive/luxury"→price=4
            - AVAILABILITY: Set open_now=true only if user specifically mentions current availability
            - RATING: Extract minimum rating only if specifically mentioned
            - ACTION: Use "search" for valid queries, "error" for invalid ones
            
            EXAMPLES:
            1. INPUT: "Find me a cheap sushi restaurant in downtown Los Angeles that's open now"
               OUTPUT: {"action":"search","parameters":{"query":"sushi","near":"downtown Los Angeles","price":1,"open_now":true}}
            
            2. INPUT: "What's the weather like today?"
               OUTPUT: {"action":"error","parameters":{"error":"non_restaurant_query"}}
            
            3. INPUT: "Find me a good restaurant"
               OUTPUT: {"action":"search","parameters":{"query":"restaurant"}}`,
            },
          ],
        },
        {
          role: "user",
          parts: [
            {
              text: "what can you tell me about the universe",
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            action: {
              type: Type.STRING,
              enum: ["restaurant_search"],
              description: "Name of action",
              nullable: true,
            },
            parameters: {
              type: Type.OBJECT,
              properties: {
                query: {
                  type: Type.STRING,
                  description: "cuisine type",
                  nullable: true,
                  example: "sushi",
                },
                near: {
                  type: Type.STRING,
                  description: "user-specified location",
                  nullable: true,
                  example: "New York",
                },
                price: {
                  type: Type.INTEGER,
                  minimum: 1,
                  maximum: 4,
                  description: "1 to 4 (1 = cheapest)",
                  nullable: true,
                  example: 2,
                },
                open_now: {
                  type: Type.BOOLEAN,
                  description: "true if user asks for it",
                  nullable: true,
                  example: false,
                },
              },
            },
          },
          required: ["action", "parameters"],
        },
      },
    });

    const responseText = await response.text;
    if (!responseText) {
      throw new Error("Response text is undefined");
    }
    const jsonData = JSON.parse(responseText);
    return NextResponse.json(jsonData);
  } catch (error: unknown) {
    return NextResponse.json({ error: "Something went wrong" });
  }
}
