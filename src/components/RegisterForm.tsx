import * as elements from "typed-html";
import Input from './Input';

const LoginForm = () => (
  <div hx-ext="response-targets" class="w-full max-w-xs">
    <form
      hx-post="/api/register"
      hx-target-400="#error-response"
      hx-target-500="#error-response"
      hx-target="this"
      class="bg-slate-900 shadow-md px-8 py-8 pb-8 mb-2 space-y-6">
      <div>
        <Input label='Username' name='username' required />
      </div>
      <div>
        <Input label='Email' name='email' required />
      </div>
      <div>
        <Input label='Password' name='password' required type="password" />
      </div>
      <div>
        <Input label='Confirm Password' name='confirm_password' required type="password" />
      </div>
      <div class="text-error text-center" id="error-response" />
      <div class="text-green text-center" id="success-response" />
      <div class="text-center space-y-4">
        <button type="submit" class="btn">
          Register
        </button>
      </div>
      <p class="text-sm text-center text-muted">If you have an account you should <a href="/login">login</a>, probably.</p>
    </form>
  </div>
);

export default LoginForm;
