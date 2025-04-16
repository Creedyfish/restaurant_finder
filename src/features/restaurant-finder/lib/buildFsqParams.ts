import { OpenAIResponse } from '@/features/restaurant-finder/schema/llmResponse'

/**
 * Builds Foursquare API query parameters from the parsed OpenAI response.
 *
 * This function takes the `parameters` object from the OpenAI response and converts it into
 * a `URLSearchParams` object that can be used to make requests to the Foursquare API.
 *
 * @param {OpenAIResponse['parameters']} parsed - The parsed parameters from the OpenAI response.
 * - `query` (string | null): The type of cuisine or restaurant being queried.
 * - `name` (string | null): The exact name of the restaurant, if specified.
 * - `near` (string | null): The geographic location for the search.
 * - `min_price` (number | null): The minimum price level (1 to 4).
 * - `max_price` (number | null): The maximum price level (1 to 4).
 * - `open_now` (boolean | null): Whether to filter for restaurants that are currently open.
 * - `sort` (string | null): The sorting criteria (`relevance`, `rating`, or `distance`).
 *
 * @returns {URLSearchParams} A `URLSearchParams` object containing the query parameters for the Foursquare API.
 */

export function buildFsqParams(parsed: OpenAIResponse['parameters']) {
  const params = new URLSearchParams()

  if (parsed.query) params.append('query', parsed.query)
  if (parsed.name) params.append('name', parsed.name)
  if (parsed.near) params.append('near', parsed.near)
  if (parsed.min_price !== null)
    params.append('min_price', parsed.min_price.toString())
  if (parsed.max_price !== null)
    params.append('max_price', parsed.max_price.toString())
  if (parsed.open_now !== null)
    params.append('open_now', parsed.open_now.toString())
  if (parsed.sort) params.append('sort', parsed.sort)
  return params
}
