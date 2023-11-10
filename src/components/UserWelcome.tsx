import { Pit } from "../db/queries";
import { User } from "../db/queries/user"
import * as elements from "typed-html";

const UserWelcome = ({ user, pit }: { user?: User, pit?: Pit }) => 
  user ? (
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
  );

export default UserWelcome;