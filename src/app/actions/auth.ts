'use server';

import { cookies } from 'next/headers';
// import jwt from 'jsonwebtoken';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
// import { redirect } from 'next/navigation';

type TokenProps = {
  userId: string;
  userName: string;
  userType: string;
  iat: number;
  token: string;
};

type User = {
  username: string;
  password: string;
  token?: string;
};

export const login = async ({ username, password }: User) => {
  try {
    // Send login request to the backend API
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API}/auth/login`,
      {
        username,
        password,
      },
    );

    // Retrieve and decode the token
    const { token } = data;
    const decodedToken = jwtDecode<User>(token);

    // Merge decoded token with the original token
    const userWithToken = { ...decodedToken, token };

    // Use the `cookies` function to set the cookie server-side
    cookies().set({
      name: 'user',
      value: JSON.stringify(userWithToken),
      httpOnly: true, // Make cookie HTTP only for security (prevents access from client-side JavaScript)
      path: '/', // Apply to all routes
      maxAge: 60 * 60 * 24 * 7, // 1 week expiry
      secure: process.env.NODE_ENV === 'production', // Set 'secure' in production
    });

    return { success: true, message: 'Login successful' };
  } catch (error: any) {
    const errorMessage = axios.isAxiosError(error)
      ? error.response?.data?.message || 'Invalid username or password'
      : 'An error occurred. Please try again.';

    return { success: false, message: errorMessage };
  }
};

export const logout = async () => {
  cookies().delete('user');
  // redirect('/login');
  return { success: true, message: 'Logout successful' };
};

export async function getAuthToken() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('accessToken') || { value: '' };
  return sessionCookie.value;
}

export async function getUser() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('user')?.value;

  if (!sessionCookie) {
    return null;
  }

  // Parse the JSON string from the cookie
  const parsedCookie = JSON.parse(sessionCookie);

  // Decode the accessToken from the parsed JSON
  const decoded = jwtDecode<TokenProps>(parsedCookie.token);

  return {
    userId: decoded.userId,
    userName: decoded.userName,
    userType: decoded.userType,
    iat: decoded.iat,
    token: parsedCookie.token,
  };
}
