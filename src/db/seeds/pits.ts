import { sql } from 'slonik';

const inserts = sql.unsafe`
  INSERT INTO pits (id, description) VALUES ('programming', 'Discussion about programming') ON CONFLICT DO NOTHING;
  INSERT INTO pits (id, description) VALUES ('food', 'Discussion about Food') ON CONFLICT DO NOTHING;
  INSERT INTO pits (id, description) VALUES ('anime', 'Discussion about Anime') ON CONFLICT DO NOTHING;
  INSERT INTO pits (id, description) VALUES ('politics', 'Discussion about Politics') ON CONFLICT DO NOTHING;
  INSERT INTO pits (id, description) VALUES ('random', 'Like /b/ only shittier') ON CONFLICT DO NOTHING;
`;

export default inserts;
