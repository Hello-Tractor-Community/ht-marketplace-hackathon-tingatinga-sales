// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";
import "next-auth/jwt";
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      sellerId?: string | null;
      businessName?: string | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    sellerId?: string | null;
    businessName?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    sellerId?: string | null;
    businessName?: string | null;
  }
}
