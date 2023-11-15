import * as elements from "typed-html";

import './dayjs';
import { Elysia } from 'elysia';
import { html } from '@elysiajs/html';
import api from './api';
import db from './db';
import { Pit, fetchAllPosts, fetchMyPosts, fetchPit, fetchAllPits, fetchPitPosts, fetchSubscriptionsPosts, fetchPost } from './db/queries';
import Posts from './components/Posts';
import Header from './components/Header';
import LoginForm from "./components/LoginForm";
import RegisterForm from './components/RegisterForm';
import PostForm from './components/PostForm';
import { userRequired, withUser } from './api/middlewares/auth';
import { User } from "./db/queries/user";
import PostView from "./components/PostView";

const MainLayout = ({ children, user, pit }: elements.Children & { user?: User, pit?: Pit }) => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>PROFANE</title>
      <script src="https://unpkg.com/htmx.org@1.9.3"></script>
      <script src="https://unpkg.com/htmx.org/dist/ext/response-targets.js"></script>
      <script src="https://cdn.tiny.cloud/1/stdoy1p9onuz76vu2e9826v43a453ufdkk4db83cn7ce8odx/tinymce/6/tinymce.min.js" referrerpolicy="origin"></script>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@600&family=Quicksand:wght@400&family=Roboto+Condensed:wght@500&display=swap" rel="stylesheet"> 
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
  .get("/login", async ({ html, user, set }) => {
    if (user) {
      set.redirect = '/';
      return 'Redirecting';
    }
    return html(
      <MainLayout user={user}>
        <div class="flex justify-center mt-5">
          <LoginForm />
        </div>
      </MainLayout>
    )
  })
  .get("/register", async ({ html, user }) => {
    return html(
      <MainLayout user={user}>
        <div class="flex justify-center mt-5">
          <RegisterForm />
        </div>
      </MainLayout>
    )
  })
  .get("/pits/:id", async ({ html, user, params: { id }, set }) => {
    const pit = await db.maybeOne(fetchPit(id, user?.id));

    if (!pit) {
      set.redirect = '/404';
      return 'Cant find that pit.'
    }

    const posts = await db.many(fetchPitPosts(id)).catch(() => undefined);
    return html(
      <MainLayout pit={pit} user={user}>
        <div>
          <div class="px-5 mb-5 space-y-5">
            <p class="border-l-4 border-slate-400 pl-3">
              {pit.description}
            </p>
            {user ? (
              <button
                class="btn"
                hx-get={`/components/subscription-button?pitId=${id}`}
                hx-swap="outerHTML"
                hx-trigger="load" />
            ) : ''}
          </div>
          <Posts posts={posts} />
        </div>
      </MainLayout>
    );
  })
  .get("/posts/:pitId/:postId", async ({ html, user, params: { postId, pitId }, set }) => {
    const pit = await db.maybeOne(fetchPit(pitId));
    const post = await db.maybeOne(fetchPost(postId));

    if (!pit) {
      set.redirect = '/404';
      return 'Cant find that pit.'
    }

    if (!post) {
      set.status = 404;
      return 'Cant find that post';
    }

    return html(
      <MainLayout pit={pit} user={user}>
        <div class="mt-5">
          <PostView post={post} />
        </div>
      </MainLayout>
    );
  })
  .get(
    "/components/posts",
    async () => {
      const posts = await db.many(fetchAllPosts())
        .catch((e) => console.error(e));
      return posts && <Posts posts={posts} />;
    }
  )
  .get(
    "/components/posts/subscribed",
    async ({ user, set }) => {
      if (!user) {
        set.status = 401;
        return 'Unauthorized';
      }

      const posts = await db.many(fetchSubscriptionsPosts(user.id));

      return <Posts posts={posts} />;
    }
  )
  .get(
    "/components/subscription-button",
    async ({ user, set, query: { pitId } }) => {
      if (!pitId) {
        set.status = 404;
        return 'Pit not found'
      }
      const pit = await db.maybeOne(fetchPit(pitId, user?.id));

      return pit?.subscribed
        ? <button
            class="btn"
            hx-swap="outerHTML"
            hx-get={`/components/subscription-button?pitId=${pitId}`}
            onclick={`fetch('/api/pits/${pitId}/unsubscribe', { method: "POST" })`}
          >
              Unsubscribe
          </button>
        : <button
          class="btn"
          hx-swap="outerHTML"
          hx-get={`/components/subscription-button?pitId=${pitId}`}
          onclick={`fetch('/api/pits/${pitId}/subscribe', { method: "POST" })`}
          >
            Subscribe
          </button>;
    }
  )
  .get("/styles.css", () => Bun.file("./tailwind-gen/styles.css"))
  .get("/404", ({ user }) => (
    <MainLayout user={user}>
      <div class="text-center mt-8">
        <h1 class="text-[8rem] font-bold">404</h1>
        <p class="text-2xl">We couldn't find that, sorry. <a href="/">Go home?</a></p>
      </div>
    </MainLayout>
  ))
  .get("*", ({ set }) => {
    set.redirect = '/404';
  })
  .use(userRequired)
  .get("/pits/:id/post", async ({ html, user, params: { id }, set }) => {
    const pit = await db.maybeOne(fetchPit(id));

    if (!pit) {
      set.status = 404;
      return 'Cant find that pit.'
    }

    const pits = await db.many(fetchAllPits());

    return html(
      <MainLayout pit={pit} user={user}>
        <div class="flex justify-center mt-5">
          <PostForm currentPit={pit} pits={pits} user={user} />
        </div>
      </MainLayout>
    );
  })
  .get(
    "/components/posts/mine",
    async ({ user }) => {
      const posts = await db.many(fetchMyPosts(user.id)).catch(() => undefined);
      return <Posts posts={posts} />;
    }
  )
  .get("/post", async ({ html, user }) => {
    const pits = await db.many(fetchAllPits());
    return html(
      <MainLayout user={user}>
        <div class="flex justify-center mt-5">
          <PostForm pits={pits} user={user} />
        </div>
      </MainLayout>
    )
  })
  .listen(3000)

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
  