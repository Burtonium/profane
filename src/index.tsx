import * as elements from "typed-html";
import { Elysia, t } from "elysia";
import sanitize from 'sanitize-html';
import { html } from "@elysiajs/html";
import { helmet } from "elysia-helmet";
import { cookie } from '@elysiajs/cookie'
import { jwt } from '@elysiajs/jwt'

import createPool from './db';
import BaseHtml from "./layouts/base";

import Posts from "./pages/pits";

// Elysia bug https://github.com/elysiajs/elysia/issues/94
type ExtendedElysiaFix = { store: {}; request: { html(v: string): Response, sanitize: typeof sanitize }; schema: {}; error: {}; meta: { schema: {}; defs: {}; exposed: {}; }; };

(async () => {
  const db = await createPool();
  const app = new Elysia<'', ExtendedElysiaFix>()
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
          <Posts posts={[]} />
        </BaseHtml>
      )
    )
    .get("/styles.css", () => Bun.file("./tailwind-gen/styles.css"))
    .listen(3000);

  console.log(
    `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
  );
})();


  // .get("/todos", async () => {
  //   const data = await db.select().from(todos).all();
  //   return <TodoList todos={data} />;
  // })
  // .post(
  //   "/todos/toggle/:id",
  //   async ({ params }) => {
  //     const oldTodo = await db
  //       .select()
  //       .from(todos)
  //       .where(eq(todos.id, params.id))
  //       .get();
  //     const newTodo = await db
  //       .update(todos)
  //       .set({ completed: !oldTodo.completed })
  //       .where(eq(todos.id, params.id))
  //       .returning()
  //       .get();
  //     return <TodoItem {...newTodo} />;
  //   },
  //   {
  //     params: t.Object({
  //       id: t.Numeric(),
  //     }),
  //   }
  // )
  // .delete(
  //   "/todos/:id",
  //   async ({ params }) => {
  //     await db.delete(todos).where(eq(todos.id, params.id)).run();
  //   },
  //   {
  //     params: t.Object({
  //       id: t.Numeric(),
  //     }),
  //   }
  // )
  // .post(
  //   "/todos",
  //   async ({ body }) => {
  //     const newTodo = await db.insert(todos).values(body).returning().get();
  //     return <TodoItem {...newTodo} />;
  //   },
  //   {
  //     body: t.Object({
  //       content: t.String({ minLength: 1 }),
  //     }),
  //   }
  // )


// function TodoItem({ content, completed, id }: Todo) {
//   return (
//     <div class="flex flex-row space-x-3">
//       <p>{content}</p>
//       <input
//         type="checkbox"
//         checked={completed}
//         hx-post={`/todos/toggle/${id}`}
//         hx-swap="outerHTML"
//         hx-target="closest div"
//       />
//       <button
//         class="text-red-500"
//         hx-delete={`/todos/${id}`}
//         hx-swap="outerHTML"
//         hx-target="closest div"
//       >
//         X
//       </button>
//     </div>
//   );
// }

// function TodoList({ todos }: { todos: Todo[] }) {
//   return (
//     <div>
//       {todos.map((todo) => (
//         <TodoItem {...todo} />
//       ))}
//       <TodoForm />
//     </div>
//   );
// }

// function TodoForm() {
//   return (
//     <form
//       class="flex flex-row space-x-3"
//       hx-post="/todos"
//       hx-swap="beforebegin"
//       _="on submit target.reset()"
//     >
//       <input type="text" name="content" class="border border-black" />
//       <button type="submit">Add</button>
//     </form>
//   );
// }
