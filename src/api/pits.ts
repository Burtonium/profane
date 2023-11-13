import Elysia, { t } from "elysia";
import setup from "../setup";
import { userRequired } from "./middlewares/auth";
import db from '../db';
import { subscribeToPit, unsubscribeToPit } from "../db/queries/subscriptions";

const pitsApi = new Elysia({ name: 'posts' })
  .use(setup)
  .use(userRequired)
  .group('/pits', (app) => app.post(
    '/:pitId/subscribe',
    async ({ user,  params, set }) => {
      await db.query(subscribeToPit(user.id, params.pitId));
      return 'Subscription successful';
    }
  )
  .post(
    '/:pitId/unsubscribe',
    async ({ user, params, set }) => {
      await db.query(unsubscribeToPit(user.id, params.pitId));
      return 'Unsubscription successful';
    },
  ))
  ;

export default pitsApi;
