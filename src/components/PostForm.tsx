import * as elements from "typed-html";
import type { Pit } from '../db/queries/pit';
import type { User } from '../db/queries/user';
import Input from './Input';


const PostForm = ({ pits, user }: { pits: readonly Pit[], user: User } ) => (
  <div hx-ext="response-targets" class="w-full container m-5">
    <div class="text-error text-center mt-0" id="error-response" />
    <form
      hx-post="/api/posts"
      hx-target-400="#error-response"
      hx-target-401="#error-response"
      hx-target-500="#error-response"
      class="bg-slate-900 shadow-md px-8 py-8 pb-8 mb-2 space-y-6">
      <div class="max-w-sm mt-0">
        <label for="pits" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Pit:
        </label>
        <select id="pits" name="pitId" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary">
          {pits.map((pit) => (
            <option value={pit.id}>{pit.id}</option>
          ))}
        </select>
      </div>
      <div>
        <Input required name="title" label="Title" />
      </div>
      <div>
        <label for="content" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Content:
        </label>
        <textarea required="true" name="content" class="editor">Fuckity fuck fuck.</textarea>
      </div>
      <input type="hidden" name="userId" value={user.id} /> 
      <div class="text-center space-y-4">
        <button onclick="tinyMCE.triggerSave();" type="submit" class="btn">
          Post
        </button>
      </div>
    </form>
  </div>
);

export default PostForm;
