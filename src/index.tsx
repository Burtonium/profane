import * as elements from "typed-html";

import './dayjs';
import { Elysia } from 'elysia';
import { html } from '@elysiajs/html';
import auth from './api/auth';
import db from './db';
import { fetchAllPosts } from "./db/queries";
import Posts from "./components/Posts";

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
  <body class="bg-slate-950">
    ${children}
  </body>
`;
  
const app = new Elysia()
  .use(html())
  .use(auth)
  .get("/", async ({ html }) => {
    return html(
      <BaseHtml>
        <div
          hx-get="/components/posts"
          hx-swap="innerHTML"
          hx-trigger="load"
        />
      </BaseHtml>
    )
  })
  .get("/components/posts", async () => {
    const posts = await db.many(fetchAllPosts());
    return <Posts posts={posts} />;
  })
  .get("/styles.css", () => Bun.file("./tailwind-gen/styles.css"))
  .listen(3000)

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
  