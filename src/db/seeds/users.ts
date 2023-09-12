import { hashPassword } from '../../utils/crypto';
import { insertUser } from '../schema/user';

const query = insertUser({
  id: 'burtonium',
  email: 'matt@burtonize.me',
  emailVerified: true,
  ...(await hashPassword('blahblah'))
});

export default query;