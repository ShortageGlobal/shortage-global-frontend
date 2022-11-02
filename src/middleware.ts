import { withAuth } from 'next-auth/middleware';

export const config = { matcher: ['/private/:path*'] };
export default withAuth({});
