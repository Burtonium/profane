import { sql } from 'slonik';
import type { PostInsert } from '../schema';

const posts: PostInsert[] = [
  {
    title: 'Love me some programming',
    content: '<p>Programming is all I love my guy. You should definitely try it</p>',
    pitId: 'programming',
    userId: 'burtonium'
  },
  {
    title: 'Hate me some programming',
    content: '<p>Programming is all I hate my guy. Run while you can</p>',
    pitId: 'programming',
    userId: 'burtonium'
  },

  {
    title: 'Hate me some programming',
    content: '<p>Programming is all I hate my guy. Run while you can</p>',
    pitId: 'programming',
    userId: 'burtonium'
  }
]

export default sql.unsafe`
  INSERT INTO posts (pit_id, user_id) VALUES ('programming', '<h1>Programming</h1><p>Discussion about programming</p>') ON CONFLICT DO NOTHING;
  INSERT INTO posts (pit_id, user_id) VALUES ('food', '<h1>Food</h1><p>Discussion about Food</p>') ON CONFLICT DO NOTHING;
  INSERT INTO posts (pit_id, user_id) VALUES ('anime', '<h1>Anime</h1><p>Discussion about Anime</p>') ON CONFLICT DO NOTHING;
  INSERT INTO posts (pit_id, user_id) VALUES ('politics', '<h1>Politics</h1><p>Discussion about Politics</p>') ON CONFLICT DO NOTHING;
`;