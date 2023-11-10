import * as elements from "typed-html";

import './dayjs';
import { Elysia } from 'elysia';
import { html } from '@elysiajs/html';
import api from './api';
import db from './db';
import { Pit, fetchAllPosts, fetchMyPosts, fetchPit, fetchAllPits, fetchPitPosts, fetchSubscriptionsPosts } from './db/queries';
import Posts from './components/Posts';
import Header from './components/Header';
import LoginForm from "./components/LoginForm";
import RegisterForm from './components/RegisterForm';
import PostForm from './components/PostForm';
import { withUser } from './api/middlewares/auth';
import { User } from "./db/queries/user";

const MainLayout = ({ children, user, pit }: elements.Children & { user?: User, pit?: Pit }) => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>PROFANE</title>
      <script src="https://unpkg.com/htmx.org@1.9.3"></script>
      <script src="https://unpkg.com/hyperscript.org@0.9.9"></script>
      <script src="https://unpkg.com/htmx.org/dist/ext/response-targets.js"></script>
      <script src="https://cdn.tiny.cloud/1/stdoy1p9onuz76vu2e9826v43a453ufdkk4db83cn7ce8odx/tinymce/6/tinymce.min.js" referrerpolicy="origin"></script>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@600&family=Quicksand&family=Roboto+Flex:wght@100;400;600&display=swap" rel="stylesheet"> 
      <link href="/styles.css" rel="stylesheet">
    </head>
    <body class="bg-slate-950">
      ${<Header pit={pit} user={user} />}
      ${children}
    </body>
    <script>
      tinymce.init({
        selector: '.editor',
        menubar: false,
        skin: 'oxide-dark',
        content_css: 'dark',
        plugins: 'anchor autolink codesample emoticons image link lists media table visualblocks checklist export formatpainter pageembed powerpaste typography inlinecss',
        toolbar: 'blocks | bold italic underline strikethrough | link table  | checklist numlist bullist | emoticons | removeformat',
      });
    </script>
  </html>
`;
  
const app = new Elysia()
  .use(html())
  .use(api)
  .use(withUser)
  .get("/", async ({ html, user }) => {
    return html(
      <MainLayout user={user}>
        <div
          hx-get={`/components/posts${user ? '/subscribed' : ''}`}
          hx-swap="innerHTML"
          hx-trigger="load"
        />
      </MainLayout>
    )
  })
  .get("/login", async ({ html, user }) => {
    return html(
      <MainLayout user={user}>
        <div class="flex justify-center mt-10">
          <LoginForm />
        </div>
      </MainLayout>
    )
  })
  .get("/register", async ({ html, user }) => {
    return html(
      <MainLayout user={user}>
        <div class="flex justify-center mt-10">
          <RegisterForm />
        </div>
      </MainLayout>
    )
  })
  .get("/post", async ({ html, user, set }) => {
    if (!user) {
      set.redirect = '/';
      return 'Redirecting...'
    }

    const pits = await db.many(fetchAllPits());
    return html(
      <MainLayout user={user}>
        <div class="flex justify-center mt-10">
          <PostForm pits={pits} user={user} />
        </div>
      </MainLayout>
    )
  })
  .get("/pits/:id", async ({ html, user, params: { id }, set }) => {
    const pit = await db.maybeOne(fetchPit(id));

    if (!pit) {
      set.status = 404;
      return 'Cant find that pit.'
    }

    const posts = await db.many(fetchPitPosts(id)).catch(() => undefined);
    return html(
      <MainLayout pit={pit} user={user}>
        <Posts posts={posts} />
      </MainLayout>
    );
  })
  .get(
    "/components/posts",
    async () => {
      const posts = await db.many(fetchAllPosts())
        .catch(() => undefined);
      return <Posts posts={posts} />;
    }
  )
  .get(
    "/components/posts/subscribed",
    async ({ user, set }) => {
      if (!user) {
        set.status = 401;
        return 'Unauthorized';
      }
      const posts = await db.many(fetchSubscriptionsPosts(user.id))
        .catch(() => undefined);
      return <Posts posts={posts} />;
    }
  )
  .get(
    "/components/posts/mine",
    async ({ user, set }) => {
      if (!user) {
        set.status = 401;
        return 'Unauthorized';
      }
      const posts = await db.many(fetchMyPosts(user.id)).catch(() => undefined);
      return <Posts posts={posts} />;
    }
  )
  .get("/styles.css", () => Bun.file("./tailwind-gen/styles.css"))
  .listen(3000)

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
  