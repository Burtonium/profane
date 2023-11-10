import { Elysia, t } from 'elysia';
import DOMPurify from 'isomorphic-dompurify';
import db from '../db';
import { authGuard } from './middlewares/auth';
import setup from '../setup';
import { insertPost, type PostInsert }  from '../db/queries/posts';
import {
	RegExpMatcher,
  englishDataset
} from 'obscenity';

const matcher = new RegExpMatcher({
	...englishDataset.build(),
});

const sanitize = (markup: string) => DOMPurify.sanitize(markup, {
  ALLOWED_TAGS: ['blockquote', 'p', 'a', 'br', 'code', 'ol', 'ul', 'li', 'pre', 'i', 'strong', 'b', 'em', 'span', 's'],
  ALLOWED_ATTR: ['target', 'href', 'rel', 'class', 'style']
});

const sanitizePost = (post: PostInsert): PostInsert => ({
  ...post,
  content: sanitize(post.content)
});

const validateContent = (content: string) => matcher.hasMatch(content);

const postsApi = new Elysia({ name: 'posts' })
  .use(setup)
  .use(authGuard)
  .post(
    '/posts',
    async ({ body, set, user }) => {
      const hasBadWords = validateContent(body.content);
      if (!hasBadWords) {
        set.status = 400;
        return 'Needs more profanity. Try a fuck or ten.'
      }


      if (user.id !== body.userId) {
        set.status = 401;
        return 'Nice try hackerboy.'
      }

      let id;
      try {
        id = (await db.one(insertPost(sanitizePost(body)))).id;
        console.log(id);
      } catch (e) {
        set.status = 500;
        console.error(e);
        return 'Fucky wucky occured';
      }

      set.headers['HX-REDIRECT'] = `/posts/${body.pitId}/${id}`;

      return 'Post created successfully';
    },
    {
      body: t.Object({
        userId: t.String(),
        content: t.String(),
        title: t.String(),
        pitId: t.String()
      })
    }
  );

export default postsApi;