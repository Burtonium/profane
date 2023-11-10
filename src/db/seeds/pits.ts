import { sql } from 'slonik';

const inserts = sql.unsafe`
  INSERT INTO pits (id, description) VALUES ('programming', '<h1>Programming</h1><p>Discussion about programming</p>') ON CONFLICT DO NOTHING;
  INSERT INTO pits (id, description) VALUES ('food', '<h1>Food</h1><p>Discussion about Food</p>') ON CONFLICT DO NOTHING;
  INSERT INTO pits (id, description) VALUES ('anime', '<h1>Anime</h1><p>Discussion about Anime</p>') ON CONFLICT DO NOTHING;
  INSERT INTO pits (id, description) VALUES ('politics', '<h1>Politics</h1><p>Discussion about Politics</p>') ON CONFLICT DO NOTHING;
  INSERT INTO pits (id, description) VALUES ('funny', '<h1>Funny</h1><p>Funny shit only</p>') ON CONFLICT DO NOTHING;
  INSERT INTO pits (id, description) VALUES ('random', '<h1>Random</h1><p>Like /b/ only shittier</p>') ON CONFLICT DO NOTHING;
`;

export default inserts;
