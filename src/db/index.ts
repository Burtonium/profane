import { createPool as cp, createSqlTag } from "slonik";
import makeInterceptor from "./interceptor";
import { z } from 'zod';

const pool = await cp(
  process.env.DATABASE_URL!,
  {
    interceptors: [
      makeInterceptor()
    ]
  }
);

export const sql = createSqlTag({
  typeAliases: {
    void: z.object({}).strict(),
    id: z.object({ id: z.string() }).strict(),
  }
})

export default pool;
