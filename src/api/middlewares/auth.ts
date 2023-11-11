import { Elysia, NotFoundError } from "elysia";
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

export const userRequired = (app: Elysia) =>
  app.use(withUser)
    .derive(async ({ user }) => {
      if (!user) throw new NotFoundError();

      return { user };
    })
    .onError(({ code, set }) => {
      if (code === 'NOT_FOUND') {
        set.redirect = '/404';
        return 'Redirecting';
      }
    })
