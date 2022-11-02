import { withAuth } from 'next-auth/middleware';

// TODO: fix workaround with the snippet from the next-auth example.
// See: https://github.com/nextauthjs/next-auth/issues/5649#issuecomment-1296262246
export default withAuth({});
export const config = { matcher: ['/private/:path*'] };
