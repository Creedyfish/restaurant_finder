import { useInfiniteQuery } from '@tanstack/react-query'
import { UserMessage } from '@/features/restaurant-finder/schema/userMessage'
import { generateRestaurantSearchQuery } from '@/features/restaurant-finder/lib/generateRestaurantSearchQuery'
import { OpenAIResponse } from '@/features/restaurant-finder/schema/llmResponse'
import { PageParam } from '@/features/restaurant-finder/schema/pagination'
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
