import { useInfiniteQuery } from '@tanstack/react-query'
import { UserMessage } from '@/features/restaurant-finder/schema/userMessage'
import { generateRestaurantSearchQuery } from '@/features/restaurant-finder/lib/generateRestaurantSearchQuery'
import { OpenAIResponse } from '@/features/restaurant-finder/schema/llmResponse'
import { PageParam } from '@/features/restaurant-finder/schema/pagination'

/**
 * A custom React hook for performing infinite restaurant search queries.
 *
 * This hook uses `react-query`'s `useInfiniteQuery` to fetch restaurant data from the API.
 * It supports both initial queries and paginated requests by managing the `pageParam` and
 * `getNextPageParam` logic.
 *
 * @param {UserMessage | null} searchQuery - The user message containing the search query details.
 * If `null`, the query is disabled.
 *
 * @returns {UseInfiniteQueryResult} The result object from `useInfiniteQuery`, which includes:
 * - `data`: The fetched data, including results and pagination information.
 * - `fetchNextPage`: A function to fetch the next page of results.
 * - `hasNextPage`: A boolean indicating whether there are more pages to fetch.
 * - `isFetching`: A boolean indicating whether a query is currently being fetched.
 * - Other properties provided by `useInfiniteQuery`.
 *
 * ## Features:
 * - Fetches restaurant data based on the user's query.
 * - Supports infinite scrolling with pagination.
 * - Handles errors gracefully and logs them to the console.
 * - Disables the query if no `searchQuery` is provided.
 * ## Error Handling:
 * - Logs errors from `generateRestaurantSearchQuery` to the console.
 * - Throws an error if no `searchQuery` is provided.
 *
 * ## Pagination Logic:
 * - `getNextPageParam`: Determines the next page's parameters based on the `nextCursor` and `params`
 *   from the last page of results.
 * - Returns `undefined` if there are no more pages to fetch.
 */

export const useInfiniteSearchQuery = (searchQuery: UserMessage | null) => {
  return useInfiniteQuery({
    queryKey: ['infiniteQuerySearch', searchQuery],
    queryFn: async ({ pageParam }: { pageParam: PageParam }) => {
      if (!searchQuery) throw new Error('No search query provided')

      try {
        return await generateRestaurantSearchQuery({
          data: searchQuery,
          pageParam,
        })
      } catch (error) {
        console.error('Error in generateRestaurantSearchQuery:', error)
        throw error
      }
    },

    getNextPageParam: (
      lastPage: { params?: OpenAIResponse; nextCursor?: string } | null,
    ) => {
      if (!lastPage || !lastPage.nextCursor) return undefined

      return {
        nextCursor: lastPage?.nextCursor || undefined,
        params: lastPage?.params,
      }
    },

    enabled: !!searchQuery,
    initialPageParam: null,
    refetchOnWindowFocus: false,
    retry: false,
  })
}
