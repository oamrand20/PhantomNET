// Imports
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Define NextAuth options
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: { label: "Phone", type: "text", placeholder: "07XXXXXXXX" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        try {
          const res = await fetch(
            `https://gray-cassowary-688759.hostingersite.com/api/login`,
            {
              method: "POST",
              body: JSON.stringify({
                phone: credentials.phone,
                password: credentials.password,
              }),
              headers: { "Content-Type": "application/json" },
            }
          );

          const user = await res.json();
          if (res.ok && user) {
            // Return the user object
            return user;
          } else {
            return null; // Invalid credentials
          }
        } catch (error) {
          console.error("Error during authorization:", error);
          return null; // Handle errors gracefully
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 365 * 24 * 60 * 60, // 1 year (essentially unlimited)
  },
  pages: {
    signIn: "/auth/login", // Custom sign-in page
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return { ...token, ...user }; // Merge user details into the token
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token as any; // Assign token data to the session user
      return session;
    },
  },
};

// Export the default handler
export default NextAuth(authOptions);
