import { NextRequest, NextResponse } from 'next/server'
import { buildFsqParams } from '@/features/restaurant-finder/lib/buildFsqParams'
import { generateLLMCommand } from '@/features/restaurant-finder/services/llmService'
import { searchRestaurants } from '@/features/restaurant-finder/services/foursquareService'
import { RequestSchema } from '@/features/restaurant-finder/schema/pagination'

/**
 * Handles POST requests for restaurant search functionality.
 *
 * This API endpoint processes user queries to search for restaurants using a combination of
 * LLM (Language Model) commands and Foursquare API. It supports both initial search queries
 * and paginated requests for subsequent results.
 *
 * @param req - The incoming HTTP request object from Next.js.
 * @returns A JSON response containing restaurant search results, pagination data, or error details.
 *
 * ## Workflow:
 * 1. **Request Validation**:
 *    - Validates the incoming request body using `RequestSchema`.
 *    - Returns a `400` status code if validation fails.
 *
 * 2. **Pagination Handling**:
 *    - If the request contains pagination data (`cursor` and `params`), it fetches the next page of results
 *      from the Foursquare API and returns them.
 *
 * 3. **Initial Query Handling**:
 *    - If the request is a new query, it uses the LLM to generate a command (`restaurant_search` or `error`).
 *    - Based on the command:
 *      - **`restaurant_search`**: Fetches restaurant data from the Foursquare API and returns the results.
 *      - **`error`**: Returns a `400` status code with an error message indicating unsupported queries.
 *
 * 4. **Error Handling**:
 *    - Logs errors to the backend console for debugging.
 *    - Returns a `500` status code with a generic error message if an unexpected error occurs.
 *
 * ## Response Structure:
 * - **Success**:
 *   ```json
 *   {
 *     "results": [...], // Array of restaurant data
 *     "nextCursor": "string", // Cursor for pagination
 *     "params": {...} // Parameters used for the query
 *   }
 *   ```
 * - **Error**:
 *   ```json
 *   {
 *     "error": "string" // Error message
 *   }
 *   ```
 *
 * ## Example Usage:
 * ### Initial Query:
 * Request:
 * ```json
 * {
 *   "query": "Find sushi restaurants in New York"
 * }
 * ```
 * Response:
 * ```json
 * {
 *   "results": [...],
 *   "nextCursor": "abc123",
 *   "params": {...}
 * }
 * ```
 *
 * ### Pagination:
 * Request:
 * ```json
 * {
 *   "cursor": "abc123",
 *   "params": {...}
 * }
 * ```
 * Response:
 * ```json
 * {
 *   "results": [...],
 *   "nextCursor": "def456",
 *   "params": {...}
 * }
 * ```
 *
 * @throws {Error} If an unexpected error occurs during processing.
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsedData = RequestSchema.safeParse(body)

    if (!parsedData.success) {
      return NextResponse.json(
        { error: parsedData.error.flatten() },
        { status: 400 },
      )
    }

    //For NextPage --pagination--
    if (
      'params' in parsedData.data &&
      parsedData.data.cursor &&
      parsedData.data.params
    ) {
      const params = buildFsqParams(parsedData.data.params.parameters)
      const fsqResponse = await searchRestaurants(
        params,
        parsedData.data.cursor,
      )
      return NextResponse.json({
        results: fsqResponse.data.results,
        nextCursor: fsqResponse.nextCursor,
        params: parsedData.data.params,
      })
    }

    //First Fetch Call

    const llmResponse = await generateLLMCommand(parsedData.data.query)

    if (llmResponse.action === 'restaurant_search') {
      const params = buildFsqParams(llmResponse.parameters)

      const fsqResponse = await searchRestaurants(params)

      return NextResponse.json({
        results: fsqResponse.data.results,
        nextCursor: fsqResponse.nextCursor,
        params: llmResponse,
      })
    } else if (llmResponse.action === 'error') {
      return NextResponse.json(
        {
          success: false,
          error:
            'This service only handles restaurant-related queries. Please try searching for restaurants, cafes, or dining establishments.',
          isRestaurantQuery: false,
        },
        { status: 400 },
      )
    } else {
      return NextResponse.json({
        success: false,
        error: 'Unsupported action type: ' + llmResponse.action,
      })
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Stack trace:', error.stack)
    } else {
      console.error('Unknown error:', error)
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 },
    )
  }
}
