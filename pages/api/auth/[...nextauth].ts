import NextAuth from "next-auth";
import prisma from "../../../lib/prisma";
import GithubProvider from "next-auth/providers/github";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: String(process.env.GITHUB_ID),
      clientSecret: String(process.env.GITHUB_SECRET),
    }),
    // ...add more providers here
  ],
  callbacks: {
    async signIn({ user, account, profile, options }: any) {
      user = await prisma.user.findUnique({
        where: {
          email: user.email,
        },
      });
      if (!user) {
        user = await prisma.user.create({
          data: {
            name: profile.name,
            email: profile.email,
            image: profile.avatar_url,
          },
        });
      }

      return true;
    },
    async jwt({ token, account }: { token: any; account?: any }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({
      session,
      token,
      user,
    }: {
      session: any;
      token: any;
      user: any;
    }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      return session;
    },
  },
};

export default NextAuth(authOptions);
