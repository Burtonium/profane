import { InferModel, relations } from "drizzle-orm";
import { integer, primaryKey, sqliteTable, text, } from "drizzle-orm/sqlite-core";
import type { AdapterAccount } from "@auth/core/adapters";

export const users = sqliteTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: integer("email_verified", { mode: "timestamp_ms" }),
  image: text("image"),
});

export const accounts = sqliteTable(
  "account",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  })
);

export const sessions = sqliteTable("session", {
  sessionToken: text("session_tokens").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const verificationTokens = sqliteTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  })
);

export const pits = sqliteTable("pits", {
  id: text("id").notNull().primaryKey(),
  name: text("content").notNull(),
  description: text("description").notNull(),
});

export const posts = sqliteTable("posts", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  pitId: text("pit_id")
    .notNull()
    .references(() => pits.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content").notNull(),
});

export const subscriptions = sqliteTable("subscriptions", {
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  pitId: text("pit_id")
    .notNull()
    .references(() => pits.id, { onDelete: "cascade" }),
}, (t) => ({
  pk: primaryKey(t.userId, t.pitId)
}));


export const accountsRelations = relations(accounts, ({ many }) => ({
  accountToPits: many(subscriptions), 
}));

export type User = InferModel<typeof users>;
export type Pit = InferModel<typeof pits>;
export type Post = InferModel<typeof posts>;
