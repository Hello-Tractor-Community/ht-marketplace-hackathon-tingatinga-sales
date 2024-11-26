import { prisma } from "@/lib/prisma/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import { URLS } from "../urls/urls";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        emailOrPhoneNumber: { label: "Phone Number", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials) return null;

        const { emailOrPhoneNumber, password } = credentials as {
          emailOrPhoneNumber: string;
          password: string;
        };

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: emailOrPhoneNumber },
              { phoneNumber: emailOrPhoneNumber },
            ],
          },
          include: {
            sellerProfile: {
              select: {
                id: true,
                businessName: true,
              },
            },
          },
        });

        if (!user) {
          throw new Error("Invalid credentials");
        }

        // Check if the provided password matches the hashed password in the database
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
          throw new Error("Invalid credentials");
        }
        // Return the user if authentication is successful
        return {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          sellerId: user.sellerProfile?.id,
          businessName: user.sellerProfile?.businessName,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt", // Change from "database" to "jwt"
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
        session.user.sellerId = token.sellerId;
        session.user.businessName = token.businessName;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.sellerId = user.sellerId;
        token.businessName = user.businessName;
      }
      return token;
    },
  },
  pages: {
    signIn: URLS.LOGIN,
  },
});
