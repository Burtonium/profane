import type { Post } from "../db/queries";
import * as elements from 'typed-html';
import dayjs from 'dayjs';

const PostView = ({ post }: { post: Post } ) => {
  
  return (
    <div class="bg-slate-900 shadow-md px-8 py-8 pb-8 mb-2 space-y-6">
      <h2 class="text-3xl font-extrabold">{post.title}</h2>
      <div class="text-lg">
        {post.content}
      </div>
      <p class="text-muted text-sm">
        Posted by
        <a href={`/users/${post.userId}`}>{post.userId}</a>
        about {dayjs().to(post.createdAt)}.
      </p>
    </div>
  );
}

export default PostView;
