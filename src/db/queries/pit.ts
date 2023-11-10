import { z } from "zod";
import { sql } from "..";

export const pit = z.object({
  id: z.string().max(30).min(3).regex(/^[a-z1-9_]+$/),
  description: z.string()
});

export type Pit = z.infer<typeof pit>;

export const fetchPit = (id: string) => sql.type(pit)`
  SELECT * FROM pits WHERE id = ${id} LIMIT 1
`;

export const fetchAllPits = () => sql.type(pit)`
  SELECT * FROM pits ORDER BY id ASC
`