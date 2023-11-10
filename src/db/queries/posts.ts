import { z } from "zod";
import { sql } from "..";

export const postInsert = z.object({
  userId: z.string().max(30).min(3).regex(/^[a-z1-9_]+$/),
  pitId: z.string().max(30).min(3).regex(/^[a-z1-9_]+$/),
  title: z.string(),
  content: z.string(),
})

export const post = z.object({
  userId: z.string().max(30).min(3).regex(/^[a-z1-9_]+$/),
  pitId: z.string().max(30).min(3).regex(/^[a-z1-9_]+$/),
  title: z.string(),
  content: z.string(),
  id: z.string().uuid(),
  createdAt: z.number(),
  updatedAt: z.number()
});

export type Post = z.infer<typeof post>;
export type PostInsert = z.infer<typeof postInsert>;

export const insertPost = (post: PostInsert) => sql.typeAlias('id')`
  INSERT INTO posts
    (pit_id, user_id, title, content)
  VALUES
    (${post.pitId}, ${post.userId}, ${post.title}, ${post.content})
  RETURNING id
`;

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
