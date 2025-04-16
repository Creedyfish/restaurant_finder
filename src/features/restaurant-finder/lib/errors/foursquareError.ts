export function handleFoursquareError(response: Response) {
  const errorMessages: Record<number, string> = {
    401: 'Invalid Foursquare API key. Please check credentials.',
    403: 'Access to this resource is forbidden.',
    404: 'The requested endpoint does not exist.',
    405: 'Method not allowed for this endpoint.',
    409: 'Conflict in request. Modify your query and try again.',
  }

  const message = errorMessages[response.status]

  if (message) {
    console.error(`Foursquare API Error: ${message}`)
  } else {
    console.error(
      `Foursquare API Error: ${response.status} ${response.statusText}`,
    )
  }

  throw new Error(
    "We couldn't retrieve restaurant information at this time. Please try again later.",
  )
}
