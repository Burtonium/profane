import { z } from "zod";
import { sql } from '../index';

export const schema = z.object({
  id: z.string().max(30).min(3).regex(/^[a-z_]+$/),
  email: z.string().email(),
  emailVerified: z.boolean(),
  hash: z.string(),
  salt: z.string()
});

export type User = z.infer<typeof schema>;

export const findUserByUsername = (username: string) => sql.type(schema)`SELECT * FROM users WHERE id = ${username} LIMIT 1`;
export const findUserByEmail = (email: string) => sql.type(schema)`SELECT * FROM users WHERE email = ${email} LIMIT 1`;

export const insertUser = (user: User) => sql.type(schema)`
  INSERT INTO
    users (id, email, email_verified, hash, salt)
  VALUES
    (${user.id}, ${user.email}, ${user.emailVerified}, ${user.hash}, ${user.salt})
  RETURNING *
`;