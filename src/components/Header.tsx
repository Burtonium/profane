import * as elements from "typed-html";
import { User } from "../db/queries/user";

const Header = ({ user }: { user?: User }) => (
  <nav class="bg-slate-950 text-white flex justify-between items-center px-5">
    <a href="/" class="font-bold uppercase font-main py-5 text-3xl text-white hover:text-white">
      Profane
    </a>
    {user && (
      <div>
        Welcome, {user.id}
      </div>
    )}
    {!user && (
      <a href='/login' class="btn btn-primary">
        Login / Register
      </a>
    )}
  </nav>
);

export default Header;
