/**
 * Handles errors returned by the Foursquare API.
 *
 * This function processes HTTP response errors from the Foursquare API and provides meaningful
 * error messages for debugging and user-facing error handling. It categorizes errors based on
 * their HTTP status codes and logs them to the backend console.
 *
 * @param {Response} response - The HTTP response object returned by the Foursquare API.
 *
 * @throws {Error} Throws a generic error with a user-friendly message if the error cannot be resolved.
 * - If the response status matches a predefined error code, it logs the corresponding error message.
 * - If the response status is not predefined, it logs the raw status and status text.
 *
 * ## Error Handling:
 * - **401**: Invalid Foursquare API key. Please check credentials.
 * - **403**: Access to this resource is forbidden.
 * - **404**: The requested endpoint does not exist.
 * - **405**: Method not allowed for this endpoint.
 * - **409**: Conflict in request. Modify your query and try again.
 *
 * ## Example Usage:
 * ```typescript
 * import { handleFoursquareError } from '@/features/restaurant-finder/lib/errors/foursquareError';
 *
 * const response = await fetch('https://api.foursquare.com/v3/places/search', { ... });
 * if (!response.ok) {
 *   handleFoursquareError(response);
 * }
 * ```
 *
 * ## Backend Logs:
 * - Logs detailed error messages to the backend console for debugging purposes.
 * - Example log for a 401 error:
 *   ```
 *   Foursquare API Error: Invalid Foursquare API key. Please check credentials.
 *   ```
 * - Example log for an unknown error:
 *   ```
 *   Foursquare API Error: 500 Internal Server Error
 *   ```
 */

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
