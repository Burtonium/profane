
import * as elements from "typed-html";
import { Post } from "../db/queries";
import dayjs from 'dayjs';

const Posts = ({ posts }: { posts?: Readonly<Post[]> }) => {
  return (
    <div>
      {posts ? posts.map((post) => (
        <div
          class="relative px-5 py-3 border-b border-slate-800 bg-slate-900 text-white hover:bg-slate-800">
          <a class="block absolute z-10 w-full h-full" href={`/posts/${post.id}`} />
          <h3 class="text-lg font-bold">
            {post.title}
          </h3>
          <p>
            Posted by
            <a class="text-primary relative z-20" href={`/users/${post.userId}`}>{post.userId}</a>
            in <a class="text-primary relative z-20" href={`/pits/${post.pitId}`}>{post.pitId}</a>
            about {dayjs().to(post.createdAt)}.
          </p>
        </div>
      )) : <div class="p-5">No posts here yet...<a href="/post">Post something?</a></div>}
    </div>
  );
}

export default Posts;
