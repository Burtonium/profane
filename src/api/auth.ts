import { Elysia, t } from 'elysia';
import db from '../db';
import { findUserByEmail, findUserByUsername, insertUser } from '../db/queries/user';
import setup from '../setup';
import { comparePassword, hashPassword } from '../utils/crypto';

export default new Elysia({ name: 'auth' })
  .use(setup)
  .post(
    "/register",
    async ({ body, set }) => {
      const { email, password, confirm_password, username } = body;

      if (password !== confirm_password) {
        set.status = 400;
        return "Password confirmation must match.";
      }

      return db.connect(async (connection) => {
        const [emailExists, usernameExists] = await Promise.all([
          connection.exists(findUserByEmail(email)),
          connection.exists(findUserByUsername(username)),
        ]);

        if (emailExists || usernameExists) {
          set.status = 400;
          return `${emailExists ? 'Email address' : ''} ${usernameExists ? 'Username' : ''} is already in use.`;
        }

        const { hash, salt } = await hashPassword(password);

        try {
          await connection.query(insertUser({
            id: username,
            email,
            emailVerified: false,
            hash,
            salt,
          }));
        } catch (e) {
          set.status = 500;
          return "Something went wrong. Please try again later."
        }

        set.status = 201;

        return "Account created. <a href=\"/login\">Sign in now.</a>";
      });
    },
    {
      body: t.Object({
        email: t.String({ pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$', default: '' }),
        username: t.String({ pattern: '^[1-9a-z_]+$', default: '' }),
        password: t.String(),
        confirm_password: t.String()
      }),
    }
  )
  .post(
    "/login",
    async ({ body, set, jwt, setCookie }) => {
      const { username, password } = body;
      const user = await db.maybeOne(findUserByUsername(username)) || await db.maybeOne(findUserByEmail(username));

      if (!user) {
        set.status = 400;
        return "User not found";
      }

      const match = await comparePassword(password, user.salt, user.hash);
      if (!match) {
        set.status = 400;
        return "Invalid credentials";
      }

      const accessToken = await jwt.sign({
        username: user.id,
      });

      setCookie("auth", accessToken, {
        maxAge: 24 * 60 * 60,
        path: "/",
      });

      set.headers['HX-Redirect'] = '/';

      return "Account login successfully";
    },
    {
      body: t.Object({
        username: t.String(),
        password: t.String(),
      }),
    }
  )
  .post(
    "/logout",
    async ({ set, cookie, setCookie }) => {
      // deleteCookie is bugged, yay
      // https://github.com/elysiajs/elysia-cookie/issues/6
      setCookie("auth", '', {
        maxAge: 0, // expires immediately
        path: "/",
      });
      delete cookie.auth;

      set.headers['HX-Redirect'] = '/';
      return 'Logged out.';
    },
  );

