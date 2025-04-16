import OpenAI from 'openai'

export function handleOpenAIError(error: any) {
  // Define error messages for different status codes
  const errorMessages: Record<number, string> = {
    400: 'Invalid request parameters',
    401: 'Authentication failed. Please check your API key',
    403: 'You do not have permission to perform this action',
    404: 'The requested resource was not found',
    422: 'The request was well-formed but could not be processed',
    429: 'Rate limit exceeded. Please try again later',
    500: 'The server encountered an error',
    502: 'Bad gateway error',
    503: 'Service unavailable',
    504: 'Gateway timeout',
  }

  if (error instanceof OpenAI.APIError) {
    const message = errorMessages[error.status]

    if (message) {
      console.error(`OpenAI API Error: ${message} - ${error.message}`)
    } else {
      console.error(
        `OpenAI API Error: Status ${error.status} - ${error.message}`,
      )
    }
  } else if (error instanceof Error) {
    console.error(`OpenAI SDK Error: ${error.message}`)
  } else {
    console.error('Unexpected OpenAI Error:', error)
  }

  throw new Error(
    "We couldn't process your restaurant query at this time. Please try again later.",
  )
}
