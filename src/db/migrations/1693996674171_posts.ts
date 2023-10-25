import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE TABLE posts (
      id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
      pit_id VARCHAR(30) NOT NULL REFERENCES pits (id) ON DELETE CASCADE,
      user_id VARCHAR(30) NOT NULL REFERENCES users (id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `)
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    DROP TABLE posts;
  `)
}
