// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import { jwtDecode } from 'jwt-decode';

export function middleware(request: NextRequest) {
  // Retrieve the user cookie which stores the token in the format: { token: 'sampletoken' }
  const userCookie = request.cookies.get('user')?.value;

  // List of protected routes
  const protectedRoutes = ['/'];

  if (
    !userCookie &&
    protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  let token: string | undefined;
  try {
    // Parse the user cookie to extract the token
    const parsedUser = JSON.parse(userCookie!);
    console.log(parsedUser);
    token = parsedUser.token;
  } catch (error) {
    // If parsing fails or token is missing, redirect to home
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  let userData: any;

  // Check user role for admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (userData.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
};
