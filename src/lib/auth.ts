// NextAuth configuration — Credentials provider with email/password.
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/password";

export const authOptions: NextAuthOptions = {
  // Use a stable secret for dev; in production this should be set via env.
  secret: process.env.NEXTAUTH_SECRET ?? "oneshot-dev-secret-change-in-production",

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password ?? "";

        if (!email || !password) return null;

        const user = await db.user.findUnique({ where: { email } });
        if (!user || !user.password) return null;

        const valid = verifyPassword(password, user.password);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? user.email.split("@")[0],
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },

  pages: {
    // We handle login/signup as in-app views, but NextAuth needs these
    // configured for error redirects. We override on the client side.
    signIn: "/",
  },
};
