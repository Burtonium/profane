import { sql } from 'slonik';

export default sql.unsafe`
  INSERT INTO
    users (id, email, email_verified, password_hash)
  VALUES
    ('burtonium', 'matt@burtonize.me', true, 'blahblah')
  ON CONFLICT DO NOTHING;
`;