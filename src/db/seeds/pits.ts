import { sql } from 'slonik';

export default sql.unsafe`
  INSERT INTO pits (id, description) VALUES ('programming', '<h1>Programming</h1><p>Discussion about programming</p>') ON CONFLICT DO NOTHING;
  INSERT INTO pits (id, description) VALUES ('food', '<h1>Food</h1><p>Discussion about Food</p>') ON CONFLICT DO NOTHING;
  INSERT INTO pits (id, description) VALUES ('anime', '<h1>Anime</h1><p>Discussion about Anime</p>') ON CONFLICT DO NOTHING;
  INSERT INTO pits (id, description) VALUES ('politics', '<h1>Politics</h1><p>Discussion about Politics</p>') ON CONFLICT DO NOTHING;
`;