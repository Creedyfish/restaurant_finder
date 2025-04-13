import { NextRequest, NextResponse } from "next/server";
import { buildFsqParams } from "@/features/restaurant-finder/lib/buildFsqParams";
import { generateLLMCommand } from "@/features/restaurant-finder/services/llmService";
import { searchRestaurants } from "@/features/restaurant-finder/services/foursquareService";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const data = await req.json();

    const llmResponse = await generateLLMCommand(data.query);

    const params = buildFsqParams(llmResponse);

    const fsqResponse = await searchRestaurants(params);

    return NextResponse.json(fsqResponse.data.results);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Stack trace:", error.stack);
    } else {
      console.error("Unknown error:", error);
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
