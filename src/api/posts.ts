import { Elysia, t } from 'elysia';
import DOMPurify from 'isomorphic-dompurify';
import db from '../db';
import { userRequired, withUser } from './middlewares/auth';
import setup from '../setup';
import { insertPost, type PostInsert }  from '../db/queries/posts';
import {
	RegExpMatcher,
  englishDataset,
  pattern
} from 'obscenity';

const matcher = new RegExpMatcher({
	...englishDataset
    .addPhrase((phrase: any) => phrase.setMetadata({ originalWord: 'shit' }).addPattern(pattern`shit`))
    .addPhrase((phrase: any) => phrase.setMetadata({ originalWord: 'cuck' }).addPattern(pattern`cuck`))
    .build(),
});

const sanitize = (markup: string) => DOMPurify.sanitize(markup, {
  ALLOWED_TAGS: ['blockquote', 'p', 'a', 'br', 'code', 'ol', 'ul', 'li', 'pre', 'i', 'strong', 'b', 'em', 'span', 's'],
  ALLOWED_ATTR: ['target', 'href', 'rel', 'class', 'style']
});

var entityMap: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
};

function escapeHtml (dirty: string) {
  return String(dirty).replace(/[&<>"'`=\/]/g, function (s) {
    return entityMap[s];
  });
}

const sanitizePost = (post: PostInsert): PostInsert => ({
  ...post,
  title: escapeHtml(post.title),
  content: sanitize(post.content)
});

const validateContent = (content: string) => matcher.hasMatch(content);

const postsApi = new Elysia({ name: 'posts' })
  .use(setup)
  .use(userRequired)
  .post(
    '/posts',
    async ({ body, set, user }) => {
      if (!user) {
        set.redirect = '/';
        return 'Unauthorized';
      }

      const hasBadWords = validateContent(body.title) || validateContent(body.content);
      if (!hasBadWords) {
        set.status = 400;
        return 'Needs more profanity.'
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
        content: t.String({ minLength: 5 }),
        title: t.String({ pattern: '' }),
        pitId: t.String()
      })
    }
  );

export default postsApi;