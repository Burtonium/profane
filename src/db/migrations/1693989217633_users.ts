import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE TABLE users (
      id VARCHAR(30) NOT NULL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      email_verified BOOLEAN NOT NULL,
      hash TEXT NOT NULL,
      salt TEXT NOT NULL
    );
  `)
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    DROP TABLE users;
  `)
}
