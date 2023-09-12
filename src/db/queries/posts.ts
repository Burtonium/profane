import { z } from "zod";
import { sql } from "..";

export const post = z.object({
  id: z.string().uuid(),
  userId: z.string().max(30).min(3).regex(/^[a-z_]+$/),
  pitId: z.string().max(30).min(3).regex(/^[a-z_]+$/),
  title: z.string(),
  content: z.string()
});

export type Post = z.infer<typeof post>;
export type PostInsert = Omit<Post, 'id'>;

export const insert = (post: PostInsert) => sql.typeAlias('void')`
  INSERT INTO posts
    (pit_id, user_id, title, content)
  VALUES
    (${post.pitId}, ${post.userId}, ${post.title}, ${post.content})`;

export const fetchAllPosts = () => sql.type(post)`
  SELECT * FROM posts ORDER BY created_at DESC LIMIT 100
`
