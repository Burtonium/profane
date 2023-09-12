import * as elements from "typed-html";

import { Elysia } from 'elysia'
import { html } from '@elysiajs/html'
import { cookie } from '@elysiajs/cookie';
import { helmet } from "elysia-helmet";
import { jwt } from '@elysiajs/jwt'


const BaseHtml = ({ children }: elements.Children) => `
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PROFANE</title>
    <script src="https://unpkg.com/htmx.org@1.9.3"></script>
    <script src="https://unpkg.com/hyperscript.org@0.9.9"></script>
    <link href="/styles.css" rel="stylesheet">
  </head>
  ${children}
`;
  
const app = new Elysia()
  .use(html())
  .use(helmet())
  .use(
    jwt({
      name: 'jwt',
      secret: process.env.JWT_SECRET!
    })
  )
  .use(cookie())
  .get('/sign/:name', async ({ jwt, cookie, setCookie, params }) => {
    setCookie('auth', await jwt.sign(params), {
        httpOnly: true,
        maxAge: 7 * 86400,
    })

    return `Sign in as ${cookie.auth}`
  })
  .get('/profile', async ({ jwt, set, cookie: { auth } }) => {
      const profile = await jwt.verify(auth)

      if (!profile) {
          set.status = 401
          return 'Unauthorized'
      }

      return `Hello ${profile.name}`
  })
  .get("/", ({ html }) =>
    html(
      <BaseHtml>
        Hello world
      </BaseHtml>
    )
  )
  .get("/styles.css", () => Bun.file("./tailwind-gen/styles.css"))
  .listen(3000)

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
  