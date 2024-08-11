'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

async function handleLogin(sessionData: string) {
  cookies().set('currentUser', sessionData, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // One week
    path: '/',
  });
  return 'Login successful';
}

export async function login(_currentState: unknown, formData: FormData) {
  const name = formData.get('name') as string;
  if (!name) {
    return { message: 'Name is required', isLoginSuccessful: false };
  } else {
    await handleLogin(name);
    return { isLoginSuccessful: true, username: name };
  }
}

function handleLogout() {
  cookies().delete('currentUser');

  redirect('/login');
}

export async function logout() {
  handleLogout();
}
