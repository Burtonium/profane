import { QuerySqlToken } from 'slonik';
import createPool from '../index';

import users from './users';
import pits from './pits';
import { ZodAny } from 'zod';

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
  });
})();