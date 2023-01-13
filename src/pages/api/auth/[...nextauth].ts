import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { requestAccessToken, refreshAccessToken } from 'core/api';
import { BACKEND_JWT_MAX_AGE, CLIENT_JWT_MAX_AGE } from 'core/constants';

const getAccessTokenExpires = () => Date.now() + BACKEND_JWT_MAX_AGE * 1000;

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
              'Authorization failed. Try again and contact support if the problem persists.'
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
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account) {
        token.account = {
          ...account,
          accessTokenExpires: getAccessTokenExpires(),
          accessToken: user.accessToken, // <-- add token to JWT (Next's) object
          refreshToken: user.refreshToken,
        };

        // remove the tokens from the user objects just so that we don't leak it somehow
        delete user.accessToken;
        delete user.refreshToken;
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.account.accessTokenExpires) {
        return token;
      }

      // Access token has expired, try to update it
      try {
        const response = await refreshAccessToken({
          refresh: token.account.refreshToken,
        });
        token.account.accessToken = response.data.access;
        token.account.accessTokenExpires = getAccessTokenExpires();

        return token;
      } catch (rejection) {
        const errorMessage =
          rejection?.response?.data?.detail || 'Operation failed';

        return {
          ...token,
          error: `RefreshAccessTokenError: ${errorMessage}`,
        };
      }
    },
    async session({ session, token }) {
      const accessToken = token.account?.accessToken;

      return {
        ...session,
        accessToken, // reveal backend jwt token to the client
        error: token.error,
      };
    },
  },
  pages: {
    signIn: '/account/sign-in/',
  },
  session: {
    maxAge: CLIENT_JWT_MAX_AGE,
  },
  jwt: {
    maxAge: CLIENT_JWT_MAX_AGE,
  },
  debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions);
