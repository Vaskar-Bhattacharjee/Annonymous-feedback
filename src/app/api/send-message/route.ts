import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";



export async function POST(request: Request) {
    await dbConnect();
    try {
        const {username, content} = await request.json();
        console.log("username and content :", username, content);
        
        const user = await UserModel.findOne({username});
        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }
        console.log("User is accepting messages:", user.isAcceptingMessage);
        if (user.isAcceptingMessage === false) {
            
            return NextResponse.json(
                { success: false, message: "User is not accepting messages" },
                { status: 403 }
            );
        }

        const newMessage = {
            content,
            createdAt: new Date(),
        }
        user.messages.push(newMessage);
        await user.save();
        return NextResponse.json(
            { success: true, message: "Message sent successfully" },
            { status: 200 }
        );
    } catch (error : any) {
        console.log(" Error in send-message route:", error);
        return NextResponse.json(
            { success: false, message: "error occuring while sending message" },
            { status: 500 }
        );
    }
}