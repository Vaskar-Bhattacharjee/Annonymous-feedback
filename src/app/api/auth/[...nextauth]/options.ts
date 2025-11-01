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
            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            {  isVerified: true }
                        ]
                    })
                    if (!user) {
                        throw new Error("No user found with the given email");
                    }
                    if (!user.isVerified) {
                        throw new Error("User email is not verified, please verify before logging in");
                    }
                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
                    if (!isPasswordValid) {
                        throw new Error("Invalid password");
                    }
                    if (user) {
                        return user;
                    }

                } catch (error : any) {
                    throw new Error("Authentication failed");
                }
  
}})
    ],
   
  callbacks: {
   
    
    async jwt({ token, user}) {
     if (user) {
        token._id = user?._id;
        token.isVerified = user?.isVerified;
        token.isAcceptingMessages = user?.isAcceptingMessages;
        token.username = user?.username;
        token.email = user?.email;
     }
      return token
    },

    async session({ session, token }) {
        if (token) {
            session.user._id = token._id as string;
            session.user.isVerified = token.isVerified as boolean;
            session.user.isAcceptingMessages = token.isAcceptingMessages as boolean;
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