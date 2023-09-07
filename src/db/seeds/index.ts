import type { QuerySqlToken } from 'slonik';
import type { ZodAny } from 'zod';

import createPool from '../index';
import users from './users';
import pits from './pits';
import posts from './posts';

(async () => {
  console.time('Connected to db');
  const pool = await createPool();

  pool.connect(async (connection) => {
    console.timeEnd('Connected to db');
    const timedQuery = async (query: QuerySqlToken<ZodAny>, label?: string) => {
      const timeLabel = `${label} inserted`;
      console.time(timeLabel);
      await connection.query(query);
      console.timeEnd(timeLabel)
    }
    await timedQuery(users, 'Users');
    await timedQuery(pits, 'Pits');
    await timedQuery(posts, 'Posts');
  });
})();