import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { API_PROTOCOL, API_HOST } from 'core/constants';

export default async function middleware(req) {
  const url = req.nextUrl;

  // next-auth calls should pass unmodified
  if (url.pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // rewrite any /api/ calls to the backend and attach Authorization header
  if (url.pathname.startsWith('/api/')) {
    // retrieve backend access jwt token from session
    const token = await getToken({ req });
    const accessToken = (token?.account as any)?.accessToken;

    // clone the request headers and set an Authorization header
    const reqHeaders = new Headers(req.headers);
    if (accessToken) {
      reqHeaders.set('Authorization', `Bearer ${accessToken}`);
    }

    // rewrite the request from next.js server to backend API
    url.protocol = API_PROTOCOL;
    url.host = API_HOST;

    return NextResponse.rewrite(url, {
      request: {
        // New request headers
        headers: reqHeaders,
      },
    });
  }
}

export const config = { matcher: ['/api/:path*'] };
