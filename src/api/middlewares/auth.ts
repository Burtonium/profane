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
