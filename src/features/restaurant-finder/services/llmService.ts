import OpenAI from 'openai'
import { OpenAIResponseSchema } from '@/features/restaurant-finder/schema/llmResponse'
import { handleOpenAIError } from '@/features/restaurant-finder/lib/errors/openAIErrors'

/**
 * Generates a command using OpenAI's GPT model to process restaurant-related queries.
 *
 * This function sends a query to the OpenAI API and expects a structured response in JSON schema format.
 * The response includes an action (`restaurant_search` or `error`) and parameters for the restaurant search.
 *
 * @param {string} query - The user query to process, such as "Find sushi restaurants in New York."
 *
 * @returns {Promise<OpenAIResponse>} The parsed response from the OpenAI API, including the action and parameters.
 *
 * @throws {Error} Throws an error if the API request fails, the response is invalid, or the OpenAI API returns an error.
 * - If the API request fails, the error is handled by `handleOpenAIError`.
 * - If the response is empty or cannot be parsed, a generic error is thrown.
 */

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY

export const generateLLMCommand = async (query: string) => {
  const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: OPENROUTER_API_KEY, // Use the environment variable
  })
  try {
    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a restaurant search API that ONLY handles restaurant-related queries',
        },
        {
          role: 'user',
          content: query,
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'restaurant',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              action: {
                type: 'string',
                enum: ['restaurant_search', 'error'],
                description:
                  'action that needs to be taken if the user is looking for a restaurant',
              },
              parameters: {
                type: 'object',
                properties: {
                  query: {
                    type: ['string', 'null'],
                    description:
                      "Type of Cuisine or type of restaurant being queried. **IMPORTANT** MUST BE THE TYPE OF THE RESTAURANT OR THE CUISINE ITS SERVING AND NOT THE WHOLE QUERY IF NOT THE JUST use the word as the value 'restaurant', And if the user asks for a suggestion answer as best as you can but it should be related to RESTAURANT CUISINES",
                  },
                  name: {
                    type: ['string', 'null'],
                    description:
                      'The exact name of the restaurant mentioned by the user, if any. Leave null if the user did not specify a restaurant name.',
                  },
                  near: {
                    type: ['string', 'null'],
                    description:
                      "Extract the **core geographic location** suitable for geocoding. \
  If the location includes descriptors like 'downtown', 'uptown', or 'central', **remove them**. \
  Only return the proper noun part, e.g. 'Chicago', 'Los Angeles', 'New York'. \
  The value must be in GEOCODE FORMAT (e.g. 'Chicago, IL') or a proper noun place name only.",
                  },
                  max_price: {
                    type: ['integer', 'null'],
                    description:
                      'sets the minimum price the user wants. 1 to 4 (1 = cheapest). if the user has not mentioned price or any thing related to that then leave at null',
                  },
                  min_price: {
                    type: ['integer', 'null'],
                    description:
                      'sets the minimum price the user wants. 1 to 4 (1 = cheapest). if the user has not mentioned price or any thing related to that then leave at null',
                  },
                  open_now: {
                    type: ['boolean', 'null'],
                    description:
                      'true if user asks if the venue is open or not. return Null when the user is not specific about this.',
                  },
                  sort: {
                    type: ['string', 'null'],
                    enum: ['relevance', 'rating', 'distance'],
                    description:
                      'Specifies how to sort the results. Use "relevance" (default), "rating", or "distance" to order the venues accordingly.',
                  },
                  open_at: {
                    type: ['string', 'null'],
                    description:
                      'Support local day and local time requests. Format is DOWTHHMM (e.g., 1T2130 = Monday 9:30PM). ' +
                      'DOW is day number (1 = Monday, 7 = Sunday). Time is 24-hour. Cannot be used with open_now. ' +
                      'If user asks about future times like "open tonight at 8pm", convert it to correct DOWTHHMM format.',
                  },
                },
                required: [
                  'query',
                  'near',
                  'min_price',
                  'max_price',
                  'open_now',
                  'name',
                  'sort',
                  'open_at',
                ],
                additionalProperties: false,
              },
            },
            required: ['action', 'parameters'],
            additionalProperties: false,
          },
        },
      },
    })

    const result = completion.choices[0].message.content

    if (!result) {
      throw new Error('Empty LLM response')
    }

    const parsed = OpenAIResponseSchema.safeParse(JSON.parse(result))
    if (!parsed.success) {
      console.error('Invalid LLM response', parsed.error)
      throw new Error('Failed to parse LLM response')
    }

    return parsed.data
  } catch (error) {
    throw handleOpenAIError(error)
  }
}
