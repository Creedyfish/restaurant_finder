import { fsqApiResponseSchema } from '../schema/fsqApiResponse'
import { handleFoursquareError } from '../lib/errors/foursquareError'
const FOURSQUARE_API_KEY = process.env.FOURSQUARE_API_KEY

/**
 * Fetches restaurant data from the Foursquare API based on the provided query parameters.
 *
 * This function constructs a query string using the provided `URLSearchParams` and sends a GET request
 * to the Foursquare API. It supports pagination using the `cursor` parameter and validates the API response
 * using a Zod schema.
 *
 * @param {URLSearchParams} params - The query parameters for the Foursquare API request.
 * - `name` (string | null): The exact name of the restaurant, if specified.
 * - `query` (string | null): The type of cuisine or restaurant being queried.
 * - `near` (string | null): The geographic location for the search.
 * - `min_price` (string | null): The minimum price level (1 to 4).
 * - `max_price` (string | null): The maximum price level (1 to 4).
 * - `sort` (string | null): The sorting criteria (`relevance`, `rating`, or `distance`).
 * - `open_now` (string | null): Whether to filter for restaurants that are currently open.
 *
 * @param {string | null} cursor - The pagination cursor for fetching the next page of results.
 *
 * @returns {Promise<{ data: any; nextCursor: string | null }>}
 * An object containing the fetched restaurant data and the next cursor for pagination.
 *
 * @throws {Error} Throws an error if the API request fails or the response validation fails.
 * - If the API request fails, the error is handled by `handleFoursquareError`.
 * - If the response validation fails, an error is logged and a generic error message is thrown.
 */

export const searchRestaurants = async (
  params: URLSearchParams,
  cursor?: string | null,
) => {
  if (cursor) {
    params.append('cursor', cursor)
  }

  const url = `https://api.foursquare.com/v3/places/search?${params.toString()}`

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: FOURSQUARE_API_KEY!,
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    handleFoursquareError(response)
  }

  let nextCursor = null
  const linkHeader = response.headers.get('link')

  if (linkHeader) {
    const match = linkHeader.match(/cursor=([^&>]+)/)

    nextCursor = match ? match[1] : null
  }

  const responseData = await response.json()

  const parsedData = fsqApiResponseSchema.safeParse(responseData)

  if (!parsedData.success) {
    console.error(
      'Foursquare API response validation failed:',
      parsedData.error,
    )
    throw new Error(
      "We couldn't retrieve restaurant information at this time. Please try again later.",
    )
  }

  return { data: parsedData.data, nextCursor }
}
