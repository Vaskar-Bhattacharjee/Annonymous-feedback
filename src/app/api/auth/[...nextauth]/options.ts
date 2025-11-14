import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";



export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: Record<"email" | "password", string> | undefined){
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials?.email },
                            {  isVerified: true }
                        ]
                    })
                    if (!user) {
                        throw new Error("No user found with the given email");
                    }
                    if (!user.isVerified) {
                        throw new Error("User email is not verified, please verify before logging in");
                    }
                    if (!credentials?.password) {
                        throw new Error("Password is required");
                    }
                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
                    if (!isPasswordValid) {
                        throw new Error("Invalid password");
                    }
                    return user

                } catch (error: unknown) {
                    if (error instanceof Error) {
                        throw new Error(`Authentication failed: ${error.message}`);
                    }
                    throw new Error("Authentication failed");
                }
  
}})
    ],
   
  callbacks: {
   
    
    async jwt({ token, user}) {
     if (user) {
        token._id = user?._id;
        token.isVerified = user?.isVerified;
        token.isAcceptingMessage = user?.isAcceptingMessage;
        token.username = user?.username;
        token.email = user?.email;
     }
      return token
    },

    async session({ session, token }) {
        if (token) {
            session.user._id = token._id as string;
            session.user.isVerified = token.isVerified as boolean;
            session.user.isAcceptingMessage = token.isAcceptingMessage as boolean;
            session.user.username = token.username as string;
            session.user.email = token.email as string;

        }
      return session
    },

    },
    pages: {
        signIn: "/signin",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};