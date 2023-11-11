import * as elements from "typed-html";
import type { Pit } from '../db/queries/pit';
import type { User } from '../db/queries/user';
import type { PostInsert } from "../db/queries";
import { sample } from 'lodash';
import Input from './Input';

const randomPosts = [{
  pitId: 'anime',
  title: 'My hot take on Jujutsu Kaisen',
  content: 'It\'s fucking mid.'
}, {
  pitId: 'programming',
  title: 'ORMs are garbage.',
  content: 'And I\'m tired of pretending they arent. Learn SQL you cunts.'
}, {
  pitId: 'politics',
  title: 'Kanye 2024',
  content: 'Having this asshole in office would fix everything.'
}, {
  pitId: 'random',
  title: 'Shoe on head thread',
  content: 'I miss those shitty threads. Where did they go?'
}]


const PostForm = ({ pits, user, currentPit }: { pits: readonly Pit[], user: User, currentPit?: Pit } ) => {
  const samplePost = currentPit ? randomPosts.find((p) => p.pitId === currentPit.id) : sample(randomPosts);

  return (
    <div hx-ext="response-targets" class="w-full container m-5">
      <div class="bg-slate-900 shadow-md px-8 py-8 pb-8 mb-2" >
        <div class="text-error text-center" id="error-response" />
        <form 
          autocomplete="off"
          class="space-y-6"
          hx-post="/api/posts"
          hx-target-400="#error-response"
          hx-target-401="#error-response"
          hx-target-500="#error-response">
          <div class="max-w-sm mt-0">
            <label for="pits" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Pit:
            </label>
            <select id="pits" name="pitId" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary">
              {pits.map((pit) => (
                samplePost?.pitId === pit.id ?
                  <option selected value={pit.id}>{pit.id}</option>
                  : <option value={pit.id}>{pit.id}</option>
              ))}
            </select>
          </div>
          <div>
            <Input required name="title" label="Title" value={samplePost?.title ?? ''} />
          </div>
          <div>
            <label for="content" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Content:
            </label>
            <textarea name="content" class="editor">{samplePost?.content}</textarea>
          </div>
          <input type="hidden" name="userId" value={user.id} /> 
          <div class="text-center space-y-4">
            <button onclick="tinyMCE.triggerSave();" type="submit" class="btn">
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostForm;
