import { z } from "zod";

export const pit = z.object({
  id: z.string().max(30).min(3).regex(/^[a-z_]+$/),
  description: z.string()
});

export type Pit = z.infer<typeof pit>;
