import { UserMessage } from '@/features/restaurant-finder/schema/userMessage'
import { PageParam } from '../schema/pagination'
interface GenerateRestaurantSearchQueryProps {
  data: UserMessage
  pageParam: PageParam
}

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
