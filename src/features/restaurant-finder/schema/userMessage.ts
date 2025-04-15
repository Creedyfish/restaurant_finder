import z from 'zod'

export const UserMessageSchema = z.object({
  query: z.string().min(1, 'Input must have more than one Character'),
})

export type UserMessage = z.infer<typeof UserMessageSchema>
