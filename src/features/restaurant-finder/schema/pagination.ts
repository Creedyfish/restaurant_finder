import { z } from 'zod'
import { OpenAIResponseSchema } from '@/features/restaurant-finder/schema/llmResponse'

export const PageParamSchema = z
  .object({
    nextCursor: z.string().optional(),
    params: OpenAIResponseSchema.optional(),
  })
  .nullable()

export const PaginationSchema = z.object({
  query: z.string(),
  cursor: z.string().optional(),
  params: OpenAIResponseSchema.optional(),
})

export const InitialFetchSchema = z.object({
  query: z.string(),
  cursor: z.string().optional(),
})

export const RequestSchema = z.union([PaginationSchema, InitialFetchSchema])

export type PaginationRequest = z.infer<typeof PaginationSchema>
export type InitialFetchRequest = z.infer<typeof InitialFetchSchema>
export type PageParam = z.infer<typeof PageParamSchema>
export type RestaurantFinderRequest = z.infer<typeof RequestSchema>
