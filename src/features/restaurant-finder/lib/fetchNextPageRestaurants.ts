interface PaginationRequest {
  params: Record<string, any>
  cursor: string
}

export const fetchNextPageRestaurants = async (data: PaginationRequest) => {
  const response = await fetch('/api/execute', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Network response was not ok')
  }

  return response.json()
}
