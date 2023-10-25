import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    CREATE TABLE subscriptions (
      user_id VARCHAR(30) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      pit_id VARCHAR(30) NOT NULL REFERENCES pits(id) ON DELETE CASCADE,
      PRIMARY KEY (user_id, pit_id)
    );
  `)
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    DROP TABLE subscriptions;
  `)
}
