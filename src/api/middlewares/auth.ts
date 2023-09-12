import { Elysia } from "elysia";
import { findUserByUsername } from "../../db/queries/user";
import db from '../../db';
import setup from "../../setup";

export const authGuard = (app: Elysia) =>
  app.use(setup)
    .derive(async ({ cookie, jwt, set }) => {
      if (!cookie.auth) {
        set.status = 401;
        return {
          success: false,
          message: "Unauthorized",
          data: null,
        };
      }
      const payload = await jwt.verify(cookie.auth);
      if (!payload) {
        set.status = 401;
        return {
          success: false,
          message: "Unauthorized",
          data: null,
        };
      }

      const user = await db.query(findUserByUsername(payload.username));
      if (!user) {
        set.status = 401;
        return {
          success: false,
          message: "Unauthorized",
          data: null,
        };
      }

      return {
        user,
      };
  });

