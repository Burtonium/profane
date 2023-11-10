import { Elysia } from 'elysia';

import auth from './auth';
import posts from './posts';

export default new Elysia({ name: 'api' })
  .group('/api', (app) => app.use(auth).use(posts));