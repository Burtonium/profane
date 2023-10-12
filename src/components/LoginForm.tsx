import * as elements from "typed-html";
import Input from './Input';

const LoginForm = () => (
  <div hx-ext="response-targets" class="w-full max-w-xs">
    <form
      hx-post="/api/login"
      hx-target-400="#error-response"
      class="bg-slate-900 shadow-md px-8 py-8 pb-8 mb-2 space-y-6">
      <div>
        <Input label='Username' name='username' required />
      </div>
      <div>
        <Input label='Password' name='password' required type="password" />
      </div>
      <div class="text-error" id="error-response" />
      <div class="text-center space-y-4">
        <button type="submit" class="btn">
          Sign In
        </button>
      </div>
      <p class="text-sm text-center text-muted">If your account 404'd on you you should <a href="/register">Register</a>probably.</p>
    </form>
  </div>
);

export default LoginForm;
