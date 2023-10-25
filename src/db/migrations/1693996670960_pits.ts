import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    CREATE TABLE pits (
      id VARCHAR(30) PRIMARY KEY,
      description TEXT,
      created_by VARCHAR(30) REFERENCES users (id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `)
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    DROP TABLE pits;
  `)
}
