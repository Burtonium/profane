
import * as elements from "typed-html";
import { Post } from "../db/schema";

const Posts = ({ posts }: { posts: Post[] }) => {
  return (
    <body
      class="flex w-full h-screen justify-center items-center bg-zinc-950 text-white"
      hx-swap="innerHTML"
      hx-trigger="load"
    >
      Hello World.
    </body>
  );
}

export default Posts;
