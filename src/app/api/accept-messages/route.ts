import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";


export async function POST(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
     
    const user = session?.user as User;
    if (!session || !session.user) {
        return Response.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        );
    }
    const userId = user.id;
    const { acceptMessages } = await request.json();
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptMessages },
            { new: true }
        );
        if (!updatedUser) {
            return Response.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }
        return Response.json(
            { success: true, message: "Message acceptance updated successfully", data: updatedUser },
            { status: 200 }
        );
    } catch (error) {
       console.error("Error updating message acceptance:", error);
       return Response.json(
           { success: false, message: "error while updating message acceptance" },
           { status: 500 }
       ); 
    }
}
export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
     
    const user = session?.user as User;
    if (!session || !session.user) {
        return Response.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        );
    }
    const userId = user.id;
    try {
       const foundUser = await UserModel.findById(userId);
       if (!foundUser) {
              return Response.json({
                success: false,
                 message: "User not found"
        }, {
            status: 404
        })
       }
         return Response.json({
            success: true,
            data: { isAcceptingMessage: foundUser.isAcceptingMessage }
        }, {
            status: 200
         })
    } catch (error: any) {
        console.error("Error fetching message acceptance status:", error);
        return Response.json({
            success: false,
            message: "Error while fetching message acceptance status"
        }, {
            status: 500
        })
    }
}
