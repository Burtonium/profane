import { z } from "zod";
import { sql } from "..";

export const pit = z.object({
  id: z.string().max(30).min(3).regex(/^[a-z1-9_]+$/),
  subscribed: z.boolean().optional().default(false),
  description: z.string()
});

export type Pit = z.infer<typeof pit>;

export const fetchPit = (id: string, userId: string | null = null) => sql.type(pit)`
  SELECT
    p.*,
    CAST(CASE WHEN s.pit_id IS NULL THEN false ELSE true END AS BOOLEAN) AS subscribed
  FROM pits p
  LEFT JOIN subscriptions s
  ON p.id = s.pit_id
  and s.user_id = ${userId}
  WHERE p.id = ${id}
  LIMIT 1
`;

export const fetchAllPits = () => sql.type(pit)`
  SELECT * FROM pits ORDER BY id ASC
`
