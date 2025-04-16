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
    open_at: z
      .string()
      .regex(/^[1-7]T[0-2][0-9][0-5][0-9]$/, {
        message:
          'Invalid format for open_at. Use DOWTHHMM, e.g., 1T2130 (Monday, 9:30PM)',
      })
      .nullable(),
  }),
})

export type OpenAIResponse = z.infer<typeof OpenAIResponseSchema>
