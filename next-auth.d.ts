import { DefaultSession, DefaultUser } from "next-auth";

// 1. Extend the User type (data returned from authorize)
declare module "next-auth" {
  interface User extends DefaultUser {
    _id: string; // Add your custom properties here
    username: string;
    isVerified: boolean;
    isAcceptingMessages: boolean;
  }

  // 2. Extend the Session type (data available in useSession)
  interface Session extends DefaultSession {
    user: {
      _id: string; // Add your custom properties here
      username: string;
      isVerified: boolean;
      isAcceptingMessages: boolean;
    } & DefaultSession["user"];
  }
}

// 3. Extend the JWT type (data stored in the token)
declare module "next-auth/jwt" {
  interface JWT {
    _id: string;
    username: string;
    isVerified: boolean;
    isAcceptingMessages: boolean;
  }
}