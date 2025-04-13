import { OpenAIResponse } from "@/features/restaurant-finder/schema/llmResponse";

export function buildFsqParams(parsed: OpenAIResponse["parameters"]) {
  const params = new URLSearchParams();

  if (parsed.query) params.append("query", parsed.query);
  if (parsed.name) params.append("name", parsed.name);
  if (parsed.near) params.append("near", parsed.near);
  if (parsed.min_price !== null)
    params.append("min_price", parsed.min_price.toString());
  if (parsed.max_price !== null)
    params.append("max_price", parsed.max_price.toString());
  if (parsed.open_now !== null)
    params.append("open_now", parsed.open_now.toString());

  return params;
}
