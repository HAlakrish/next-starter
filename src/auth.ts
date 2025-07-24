import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { ZodError } from "zod";

// Your own logic for dealing with plaintext password strings; be careful!
import { saltAndHashPassword } from "@/utils/password";

import { signInSchema } from "./lib/zod";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials, req) => {
        try {
          const { email, password } =
            await signInSchema.parseAsync(credentials);

          // logic to salt and hash password
          const pwHash = saltAndHashPassword(password);

          // logic to verify if the user exists
          //const user = await getUserFromDb(email, pwHash);

          // Mock users with different roles for demonstration
          const mockUsers = [
            {
              id: "1",
              email: "admin@example.com",
              name: "Admin User",
              role: "admin",
            },
            {
              id: "2",
              email: "manager@example.com",
              name: "Manager User",
              role: "manager",
            },
            {
              id: "3",
              email: "user@example.com",
              name: "Regular User",
              role: "user",
            },
          ];

          const user = mockUsers.find((u) => u.email === email);

          if (!user) {
            return null;
          }

          return user;
        } catch (error) {
          if (error instanceof ZodError) {
            return null;
          }
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = (user as any).role; // Add role to token
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.role = token.role as string; // Add role to session
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    signOut: "",
    error: "/auth/error",
  },
});
