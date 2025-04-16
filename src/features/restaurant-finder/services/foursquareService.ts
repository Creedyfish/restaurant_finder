import { fsqApiResponseSchema } from '../schema/fsqApiResponse'

const FOURSQUARE_API_KEY = process.env.FOURSQUARE_API_KEY

export const searchRestaurants = async (
  params: URLSearchParams,
  cursor?: string | null,
) => {
  const searchParams = new URLSearchParams()

  if (params.get('name') || params.get('query')) {
    searchParams.append(
      'query',
      params.get('name') || params.get('query') || '',
    )
  }

  searchParams.append(
    'fields',
    'fsq_id,hours,rating,price,name,location,categories,photos',
  )

  if (params.get('near')) {
    searchParams.append('near', params.get('near') || '')
  }

  searchParams.append('limit', '10')

  if (params.get('min_price')) {
    searchParams.append('min_price', params.get('min_price') || '')
  }

  if (params.get('max_price')) {
    searchParams.append('max_price', params.get('max_price') || '')
  }

  if (params.get('sort')) {
    searchParams.append('sort', params.get('sort') || '')
  }

  if (params.get('open_now')) {
    searchParams.append('open_now', params.get('open_now') || '')
  }

  if (cursor) {
    searchParams.append('cursor', cursor)
  }

  const url = `https://api.foursquare.com/v3/places/search?${searchParams.toString()}`

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: FOURSQUARE_API_KEY!,
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(
      `Foursquare API error: ${response.status} ${response.statusText}`,
    )
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
    throw new Error(
      "We couldn't retrieve restaurant information at this time. Please try again later.",
    )
  }

  return { data: parsedData.data, nextCursor }
}
