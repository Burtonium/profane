import { z } from "zod";

export const post = z.object({
  id: z.string().uuid(),
  userId: z.string().max(30).min(3).regex(/^[a-z_]+$/),
  pitId: z.string().max(30).min(3).regex(/^[a-z_]+$/),
  title: z.string(),
  content: z.string()
});

export type Post = z.infer<typeof post>;
export type PostInsert = Omit<Post, 'id'>;
