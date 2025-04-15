import { useInfiniteQuery } from '@tanstack/react-query'
import { UserMessage } from '@/features/restaurant-finder/schema/userMessage'
import { generateRestaurantSearchQuery } from '@/features/restaurant-finder/lib/generateRestaurantSearchQuery'
import { OpenAIResponse } from '@/features/restaurant-finder/schema/llmResponse'
import { PageParam } from '@/features/restaurant-finder/schema/pagination'
export const useInfiniteSearchQuery = (searchQuery: UserMessage | null) => {
  return useInfiniteQuery({
    queryKey: ['infiniteQuerySearch', searchQuery],
    queryFn: async ({ pageParam }: { pageParam: PageParam }) => {
      if (!searchQuery) return null

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
      console.log({
        'this is the nextpage function': lastPage?.params,
        'this is the lastpage object': lastPage,
      })
      return {
        nextCursor: lastPage?.nextCursor || undefined,
        params: lastPage?.params,
      }
    },
    enabled: !!searchQuery,
    initialPageParam: null,
    refetchOnWindowFocus: false,
  })
}
