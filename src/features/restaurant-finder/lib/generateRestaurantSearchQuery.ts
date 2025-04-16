import { UserMessage } from '@/features/restaurant-finder/schema/userMessage'
import { PageParam } from '../schema/pagination'
interface GenerateRestaurantSearchQueryProps {
  data: UserMessage
  pageParam: PageParam
}

/**
 * Generates a restaurant search query by sending a POST request to the `/api/execute` endpoint.
 *
 * This function handles both initial queries and paginated requests by passing the appropriate
 * parameters (`cursor` and `params`) to the API. It processes the response and returns the results,
 * pagination data, and query parameters.
 *
 * @param {GenerateRestaurantSearchQueryProps} props - The input properties for the query.
 * @param {UserMessage} props.data - The user message containing the query details.
 * @param {PageParam} props.pageParam - The pagination data, including the cursor and query parameters.
 *
 * @returns {Promise<{ results: any[]; nextCursor: string | null; params: any }>}
 * An object containing the search results, the next cursor for pagination, and the query parameters.
 *
 * @throws {Error} Throws an error if the API request fails or the response is invalid.
 * - If `response.ok` is `false`, an error is thrown with the message from the API response.
 * - If the query is determined to be non-restaurant-related, an error with the name `NonRestaurantQueryError` is thrown.
 */

export const generateRestaurantSearchQuery = async ({
  data,
  pageParam,
}: GenerateRestaurantSearchQueryProps) => {
  const response = await fetch('/api/execute', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...data,
      cursor: pageParam?.nextCursor ?? null,
      params: pageParam?.params ?? null,
    }),
  })
  const responseData = await response.json()

  if (!response.ok) {
    const error = new Error(responseData.error || 'An error occurred')

    if (responseData.isRestaurantQuery === false) {
      error.name = 'NonRestaurantQueryError'
    }
    throw error
  }

  return {
    results: responseData.results,
    nextCursor: responseData.nextCursor,
    params: responseData.params,
  }
}
