import { Elysia, t } from 'elysia';
import db from '../db';
import { findUserByEmail, findUserByUsername, insertUser } from '../db/queries/user';
import setup from '../setup';
import { comparePassword, hashPassword } from '../utils/crypto';

export default new Elysia({ name: 'auth' })
  .use(setup)
  .group("/api", (app) => app
    .post(
      "/signup",
      async ({ body, set }) => {
        const { email, password, username } = body;
        db.connect(async (connection) => {
          const [emailExists, usernameExists] = await Promise.all([
            connection.exists(findUserByEmail(email)),
            connection.exists(findUserByUsername(username)),
          ]);

          if (emailExists || usernameExists) {
            set.status = 400;
            return {
              success: false,
              data: null,
              message: `${emailExists ? 'Email address' : ''} ${usernameExists ? 'Username' : ''} is already in use.`
            };
          }

          const { hash, salt } = await hashPassword(password);

          const newUser = await connection.one(insertUser({
            email,
            emailVerified: false,
            hash,
            salt,
            id: username,
          }));
  
          return {
            success: true,
            message: "Account created",
            data: {
              user: newUser,
            },
          };
        })
      },
      {
        body: t.Object({
          name: t.String(),
          email: t.String(),
          username: t.String(),
          password: t.String(),
        }),
      }
    )
    .post(
      "/login",
      async ({ body, set, jwt, setCookie }) => {
        const { username, password } = body;
        // verify email/username
        const user = await db.maybeOne(findUserByUsername(username));

        if (!user) {
          set.status = 400;
          return {
            success: false,
            data: null,
            message: "Invalid credentials",
          };
        }

        const match = await comparePassword(password, user.salt, user.hash);
        if (!match) {
          set.status = 400;
          return {
            success: false,
            data: null,
            message: "Invalid credentials",
          };
        }

        const accessToken = await jwt.sign({
          username: user.id,
        });

        setCookie("auth", accessToken, {
          maxAge: 24 * 60 * 60, // 24 hours
          path: "/",
        });


        return {
          success: true,
          data: null,
          message: "Account login successfully",
        };
      },
      {
        body: t.Object({
          username: t.String(),
          password: t.String(),
        }),
      }
    )
  );

