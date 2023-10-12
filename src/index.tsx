import * as elements from "typed-html";

import './dayjs';
import { Elysia } from 'elysia';
import { html } from '@elysiajs/html';
import auth from './api/auth';
import db from './db';
import { fetchAllPosts } from './db/queries';
import Posts from './components/Posts';
import Header from './components/Header';
import LoginForm from "./components/LoginForm";

const MainLayout = ({ children }: elements.Children) => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>PROFANE</title>
      <script src="https://unpkg.com/htmx.org@1.9.3"></script>
      <script src="https://unpkg.com/hyperscript.org@0.9.9"></script>
      <script src="https://unpkg.com/htmx.org/dist/ext/response-targets.js"></script>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@600&family=Quicksand&family=Roboto+Flex:wght@100;400;600&display=swap" rel="stylesheet"> 
      <link href="/styles.css" rel="stylesheet">
    </head>
    <body class="bg-slate-950">
      ${<Header />}
      ${children}
    </body>
  </html>
`;
  
const app = new Elysia()
  .use(html())
  .use(auth)
  .get("/", async ({ html }) => {
    return html(
      <MainLayout>
        <div
          hx-get="/components/posts"
          hx-swap="innerHTML"
          hx-trigger="load"
        />
      </MainLayout>
    )
  })
  .get("/login", async ({ html }) => {
    return html(
      <MainLayout>
        <div class="flex justify-center mt-10">
          <div
            hx-get="/components/login"
            hx-swap="innerHTML"
            hx-trigger="load"
          />
        </div>
      </MainLayout>
    )
  })
  .get("/components/posts", async () => {
    const posts = await db.many(fetchAllPosts());
    return <Posts posts={posts} />;
  })
  .get('/components/login', async ({ html }) => {
    return html(<LoginForm />);
  })
  .get("/styles.css", () => Bun.file("./tailwind-gen/styles.css"))
  .listen(3000)

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
  