import * as elements from "typed-html";
import { User } from "../db/queries/user";
import { Pit } from "../db/queries";

const Header = ({ user, pit }: { user?: User, pit?: Pit }) => (
  <nav class="bg-slate-950 text-white flex justify-between items-center px-5">
    <div class="flex items-center space-x-5">
      <a href="/" class="font-bold uppercase font-main py-5 text-3xl text-white hover:text-white">
        Profane
      </a>
      {pit ? <p class="text-xl">[<a href="#" class="text-primary">{pit.id}</a>]</p> : ''}
    </div>
    {user ? (
      <div>
        <span>
          Welcome, <a href="#">{user.id}</a>
        </span>
        {pit ? (
          <a href={`/pits/${pit.id}/post`} class="btn btn-primary ml-3">
            Post
          </a>
        ) : ''}
        <button hx-post="/api/logout" class="btn btn-primary ml-3">
          Logout
        </button>
      </div>
    ) : (
      <a href='/login' class="btn btn-primary">
        Login / Register
      </a>
    )}
  </nav>
);

export default Header;
