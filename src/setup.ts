import Elysia from 'elysia';
import { cookie } from '@elysiajs/cookie';
import { jwt } from '@elysiajs/jwt';
import { html } from '@elysiajs/html';

const setup = new Elysia({ name: 'setup' })
  .use(html())
  .use(
    jwt({
      name: 'jwt',
      secret: process.env.JWT_SECRET!
    })
  )
  .use(cookie());

export default setup;
