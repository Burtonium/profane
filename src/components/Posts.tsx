
import * as elements from "typed-html";
import { Post } from "../db/queries";

const Posts = ({ posts }: { posts: Readonly<Post[]> }) => {
  return(
    <div>
      {posts.map((post) => (
        <div
          class="px-5 py-3 border-b border-slate-800 bg-slate-900 text-white cursor-pointer hover:bg-slate-800">
          <h3 class="text-lg font-bold">
            {post.title}
          </h3>
          <p>Posted by <a class="text-orange-300" href="#">{post.userId}</a> in <a class="text-orange-300" href="#">{post.pitId}</a></p>
          
        </div>
      ))}
    </div>
  );
}

export default Posts;
