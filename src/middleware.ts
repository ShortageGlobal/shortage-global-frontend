import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';
import { API_ROOT } from 'app/constants';

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    // retrieve backend access jwt token from session
    const accessToken = (req.nextauth?.token?.account as any)?.accessToken;

    if (req.nextUrl.pathname.startsWith('/api/private')) {
      return NextResponse.rewrite(new URL('/about-2', req.url));
    }

    console.log('MIDDLEWARE');

    // console.log(req.nextUrl.href);
    // console.log(!!req.nextauth.token.account.accessToken);
  }
);

export const config = { matcher: ['/private/:path*', '/api/private/:path*'] };
