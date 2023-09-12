import type { QuerySqlToken } from 'slonik';
import type { ZodAny } from 'zod';
import assert from 'assert';

import db, { sql } from '../index';

(async () => {
  assert(process.env.NODE_ENV !== 'production', 'Please dont do this, lol.');
  await db.query(sql.unsafe`
    DELETE FROM subscriptions WHERE 1 = 1;
    DELETE FROM posts WHERE 1 = 1;
    DELETE FROM pits WHERE 1 = 1;
    DELETE FROM users WHERE 1 = 1;
  `);
  console.log('DB successfully cleared');
  process.exit();
})();