import OpenAI from 'openai'

/**
 * Handles errors returned by the OpenAI API or SDK.
 *
 * This function processes errors from the OpenAI API and provides meaningful error messages
 * for debugging and user-facing error handling. It categorizes errors based on their type
 * (e.g., API errors, SDK errors, or unexpected errors) and logs them to the backend console.
 *
 * @param {any} error - The error object returned by the OpenAI API or SDK.
 *
 * @throws {Error} Throws a generic error with a user-friendly message if the error cannot be resolved.
 * - If the error is an `OpenAI.APIError`, it logs the error status and message based on predefined error codes.
 * - If the error is an instance of `Error`, it logs the SDK error message.
 * - For unexpected errors, it logs the raw error object.
 * * ## Backend Logs:
 * - Logs detailed error messages to the backend console for debugging purposes.
 * - Example log for a 401 error:
 *   ```
 *   OpenAI API Error: Authentication failed. Please check your API key - Invalid API key
 *   ``
 */

export function handleOpenAIError(error: any) {
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
