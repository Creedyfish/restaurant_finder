import { z } from 'zod'

export const OpenAIResponseSchema = z.object({
  action: z.enum(['restaurant_search', 'error']),
  parameters: z.object({
    query: z.string().nullable(),
    name: z.string().nullable(),
    near: z.string().nullable(),
    max_price: z.number().int().min(1).max(4).nullable(),
    min_price: z.number().int().min(1).max(4).nullable(),
    open_now: z.boolean().nullable(),
    sort: z.enum(['relevance', 'rating', 'distance']),
  }),
})

export type OpenAIResponse = z.infer<typeof OpenAIResponseSchema>
