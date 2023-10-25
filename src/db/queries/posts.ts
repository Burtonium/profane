import { z } from "zod";
import { sql } from "..";

export const post = z.object({
  id: z.string().uuid(),
  userId: z.string().max(30).min(3).regex(/^[a-z1-9_]+$/),
  pitId: z.string().max(30).min(3).regex(/^[a-z1-9_]+$/),
  title: z.string(),
  content: z.string(),
  createdAt: z.number(),
  updatedAt: z.number()
});

export type Post = z.infer<typeof post>;
export type PostInsert = Omit<Post, 'id' | 'createdAt' | 'updatedAt'>;

export const insert = (post: PostInsert) => sql.typeAlias('void')`
  INSERT INTO posts
    (pit_id, user_id, title, content)
  VALUES
    (${post.pitId}, ${post.userId}, ${post.title}, ${post.content})`;

export const fetchAllPosts = () => sql.type(post)`
  SELECT * FROM posts ORDER BY created_at DESC LIMIT 100
`

export const fetchMyPosts = (username: string) => sql.type(post)`
  SELECT * FROM posts WHERE user_id = ${username} ORDER BY created_at DESC LIMIT 100
`

export const fetchSubscriptionsPosts = (username: string) => sql.type(post)`
  SELECT * FROM posts p
  JOIN subscriptions s
  ON p.pit_id = p.pit_id
  WHERE s.user_id = ${username} ORDER BY created_at DESC LIMIT 100
`

export const fetchPitPosts = (pitId: string) => sql.type(post)`
  SELECT * FROM posts p
  WHERE pit_id = ${pitId} ORDER BY created_at DESC LIMIT 100
`
