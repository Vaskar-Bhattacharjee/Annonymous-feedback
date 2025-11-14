import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
//import { User } from "next-auth";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
    await dbConnect();
    const session = await getServerSession(authOptions);
     
    const user = session?.user._id ;
    if (!user) {
        return NextResponse.json(
            { success: false, message: "Unauthorized. you need to login first" },
            { status: 401 }
        );
    }
    const userId = new mongoose.Types.ObjectId(user);

    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind:{ path: "$messages" , preserveNullAndEmptyArrays: true} },
            { $sort: { "messages.createdAt": -1 } },
            { $group: {_id: "$_id", messages: { $push: "$messages" }}},
            {
                $project: {
                messages: {
                    $filter: {
                    input: '$messages',
                    as: 'm',
                    cond: { $ne: ['$$m', null] } // drop null entries
                    }
                }
                }
  }
        ])
        if (!user || user.length === 0) {
            console.log("User not found");
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { success: true,
             messages: user[0].messages },
            { status: 200 }
        );
    } catch (error : unknown) {
        console.error('Error occurred while getting messages:', error);
        return NextResponse.json(
            { success: false, message: "error occuring while getting message function triggered" },
            { status: 500 }
        );
    }

    
}
