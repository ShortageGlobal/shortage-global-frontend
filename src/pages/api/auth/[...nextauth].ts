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
        // Add logic here to look up the user from the credentials supplied

        try {
          await requestAccessToken({
            email: credentials.email,
            password: credentials.password,
          });
        } catch (rejection) {
          throw new Error(
            rejection?.response?.data?.detail ||
              'Authorization failed. Try again and contact support if the problem persists'
          );
        }

        const user = { id: credentials.email, email: credentials.email };

        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;
        }
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
      return session;
    },
  },
  pages: {
    signIn: '/account/sign-in',
  },
  session: {
    maxAge: 60,
  },
};
export default NextAuth(authOptions);
