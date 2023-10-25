import { Elysia } from "elysia";
import { findUserByUsername } from "../../db/queries/user";
import db from '../../db';
import setup from "../../setup";

export const withUser = (app: Elysia) =>
  app.use(setup)
    .derive(async ({ cookie, jwt }) => {
      const payload = cookie.auth && await jwt.verify(cookie.auth);
      const user = payload && await db.maybeOne(findUserByUsername(payload.username));

      return {
        user: user || undefined,
      };
  });

  export const authGuard = (app: Elysia) =>
    app.use(setup)
      .derive(async ({ cookie, jwt, set }) => {
        if (!cookie.auth) {
          set.status = 401;
          return "Unauthorized";
        }
        
        const payload = await jwt.verify(cookie.auth);
        if (!payload) {
          set.status = 401;
          return "Unauthorized";
        }

        const user = await db.query(findUserByUsername(payload.username));
        if (!user) {
          set.status = 401;
          return "Unauthorized";
        }

        return {
          user,
        };
    });
