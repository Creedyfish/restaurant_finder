import z from "zod";

export const UserMessageSchema = z.object({
  query: z.string(),
});

export type UserMessage = z.infer<typeof UserMessageSchema>;
