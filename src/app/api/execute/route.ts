import { NextRequest, NextResponse } from 'next/server'
import { buildFsqParams } from '@/features/restaurant-finder/lib/buildFsqParams'
import { generateLLMCommand } from '@/features/restaurant-finder/services/llmService'
import { searchRestaurants } from '@/features/restaurant-finder/services/foursquareService'
import { RequestSchema } from '@/features/restaurant-finder/schema/pagination'
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
      // Return a 400 Bad Request with a helpful message
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
