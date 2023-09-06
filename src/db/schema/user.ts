import { z } from "zod";

export const user = z.object({
  id: z.string().max(30).min(3).regex(/^[a-z_]+$/),
  email: z.string().email(),
  emailVerified: z.boolean(),
  passwordHash: z.string()
});

export type User = z.infer<typeof user>;
