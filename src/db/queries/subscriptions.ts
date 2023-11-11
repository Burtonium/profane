import { z } from "zod";
import { sql } from "..";

export const subscription = z.object({
  pitId: z.string().max(30).min(3).regex(/^[a-z1-9_]+$/),
  userId: z.string().max(30).min(3).regex(/^[a-z1-9_]+$/)
});

export type Subscription = z.infer<typeof subscription>;


export const subscribeToAllPits = (userId: string) => sql.typeAlias('void')`
  INSERT INTO SUBSCRIPTIONS
    (user_id, pit_id)
  SELECT ${userId}, id FROM pits
`
