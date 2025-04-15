import { NextRequest, NextResponse } from 'next/server'
import { buildFsqParams } from '@/features/restaurant-finder/lib/buildFsqParams'
import { generateLLMCommand } from '@/features/restaurant-finder/services/llmService'
import { searchRestaurants } from '@/features/restaurant-finder/services/foursquareService'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    //For NextPage --pagination--
    if (data.params && data.cursor) {
      const params = buildFsqParams(data.params.parameters)
      const fsqResponse = await searchRestaurants(params, data.cursor)
      return NextResponse.json({
        results: fsqResponse.data.results,
        nextCursor: fsqResponse.nextCursor,
        params: data.params,
      })
    }

    //First Fetch Call

    const llmResponse = await generateLLMCommand(data.query)

    if (llmResponse.action === 'restaurant_search') {
      const params = buildFsqParams(llmResponse.parameters)

      const fsqResponse = await searchRestaurants(params, data.cursor || null)

      return NextResponse.json({
        results: fsqResponse.data.results,
        nextCursor: fsqResponse.nextCursor,
        params: llmResponse,
      })
    } else if (llmResponse.action === 'error') {
      throw new Error('Error user does not query for restaurants')
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
