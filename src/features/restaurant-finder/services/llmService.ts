import OpenAI from "openai";
import { OpenAIResponseSchema } from "@/features/restaurant-finder/schema/llmResponse";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
export const generateLLMCommand = async (query: string) => {
  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: OPENROUTER_API_KEY,
  });

  const completion = await openai.chat.completions.create({
    model: "openai/gpt-4o-mini",

    messages: [
      {
        role: "system",
        content:
          "You are a restaurant search API that ONLY handles restaurant-related",
      },
      {
        role: "user",
        content: query,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "restaurant",
        strict: true,
        schema: {
          type: "object",
          properties: {
            action: {
              type: "string",
              enum: ["search", "error"],
              description:
                "action that needs to be taken if the user is looking for a restaurant",
            },
            parameters: {
              type: "object",
              properties: {
                query: {
                  type: ["string", "null"],
                  description:
                    "Type of Cuisine or type of restaurant being queried. **IMPORTANT** MUST BE THE TYPE OF THE RESTAURANT OR THE CUISINE ITS SERVING AND NOT THE WHOLE QUERY IF NOT THE JUST use the word as the value 'restaurant', And if the user asks for a suggestion answer as best as you can but it should be related to RESTAURANT CUISINES",
                },
                name: {
                  type: ["string", "null"],
                  description:
                    "The exact name of the restaurant mentioned by the user, if any. Leave null if the user did not specify a restaurant name.",
                },
                near: {
                  type: ["string", "null"],
                  description:
                    "user-specified location and **IMPORTANT** it must be in GEOCODE FORMAT",
                },
                max_price: {
                  type: ["integer", "null"],

                  description:
                    "sets the minimum price the user wants. 1 to 4 (1 = cheapest)",
                },
                min_price: {
                  type: ["integer", "null"],

                  description:
                    "sets the minimum price the user wants. 1 to 4 (1 = cheapest)",
                },
                open_now: {
                  type: ["boolean", "null"],
                  description: "true if user asks if the venue is open or not",
                },
              },
              required: [
                "query",
                "near",
                "min_price",
                "max_price",
                "open_now",
                "name",
              ],
              additionalProperties: false,
            },
          },
          required: ["action", "parameters"],
          additionalProperties: false,
        },
      },
    },
  });

  const result = completion.choices[0].message.content;
  if (!result) throw new Error("Empty LLM response");

  const parsed = OpenAIResponseSchema.safeParse(JSON.parse(result));
  if (!parsed.success) throw new Error("Invalid LLM response");

  return parsed.data.parameters;
};
