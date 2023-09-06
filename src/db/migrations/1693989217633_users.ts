import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    CREATE TABLE USERS (
      id int PRIMARY KEY,
      username TEXT,
      email TEXT NOT NULL,
      email_verified BOOLEAN NOT NULL
    );
  `)
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    DROP TABLE USERS;
  `)
}
