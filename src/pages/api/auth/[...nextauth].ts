import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { requestAccessToken } from 'core/api';

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        let response;
        try {
          response = await requestAccessToken({
            email: credentials.email,
            password: credentials.password,
          });
        } catch (rejection) {
          throw new Error(
            rejection?.response?.data?.detail ||
              'Authorization failed. Try again and contact support if the problem persists'
          );
        }

        return {
          id: credentials.email,
          email: credentials.email,
          accessToken: response.data.access,
          refreshToken: response.data.refresh,
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      user && (token.user = user);
      return token;
    },
    session: async ({ session, token }) => {
      session.user = token.user; // Setting token in session
      session.accessToken = token.accessToken;
      session.error = token.error;
      return session;
    },
  },
  pages: {
    signIn: '/account/sign-in',
  },
  session: {
    maxAge: 60, // 60 seconds
  },
  debug: process.env.NODE_ENV === 'development',
};
export default NextAuth(authOptions);
