'use client';

import { useFormStatus } from 'react-dom';
import { login } from '../lib/actions';
import { useActionState } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const [loginResult, loginDispatch] = useActionState(login, undefined);

  const router = useRouter();

  if (loginResult?.isLoginSuccessful) {
    router.push(`/chat?username=${loginResult.username}`);
  }

  return (
    <form action={loginDispatch}>
      <input type="name" name="name" placeholder="name" required />
      <div>{loginResult && <p>{loginResult.message}</p>}</div>
      <LoginButton />
    </form>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (pending) {
      event.preventDefault();
    }
  };

  return (
    <button aria-disabled={pending} type="submit" onClick={handleClick}>
      Login
    </button>
  );
}
