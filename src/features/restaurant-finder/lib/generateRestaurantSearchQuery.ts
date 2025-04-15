import { UserMessage } from '@/features/restaurant-finder/schema/userMessage'
import { PageParam } from '@/features/restaurant-finder/schema/pagination'
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

  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  const responseData = await response.json()

  return {
    results: responseData.results,
    nextCursor: responseData.nextCursor,
    params: responseData.params,
  }
}
