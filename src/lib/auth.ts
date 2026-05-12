import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Agent Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "agent@kejanihomes.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // V1: Simple hardcoded check to lock down the platform.
        // In later phases, this will check an Agent or HostProfile database table.
        if (
          credentials?.email === "admin@kejanihomes.com" &&
          credentials?.password === "password"
        ) {
          // Any object returned will be saved in `user` property of the JWT
          return { id: "1", name: "Admin Agent", email: "admin@kejanihomes.com", role: "admin" }
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null
        }
      }
    })
  ],
  pages: {
    signIn: '/host/login',
    error: '/host/login', // Error code passed in query string as ?error=
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "kejani_homes_secret_dev_key_2026",
};
