import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import {usernameValidation} from "@/schemas/signUpSchema";

const usernameQuerySchema = z.object({
    username: usernameValidation
});

export async function GET(request: Request) {
    await dbConnect();
    try {
        const {searchParams} = new URL(request.url);
        const queryParam = {
            username: searchParams.get("username") || ""
        }
        const result = usernameQuerySchema.safeParse(queryParam);
        if (!result.success) {
            const formattedError = z.treeifyError(result.error);
            const usernameErrors = formattedError.properties?.username?.errors || formattedError.errors || ["Invalid username"];

            return Response.json(
                { success: false,
                 message: usernameErrors.length > 0 ? usernameErrors : "Invalid username" },
                { status: 400 }
            );
        }
        const { username } = result.data;
        const existingUser = await UserModel.findOne({
            username,
            isVerified: true
        });
        if (existingUser) {
            return Response.json(
                { success: false, message: "Username is already taken" },
                { status: 200 }
            );
        } else {
            return Response.json(
                { success: true, message: "Username is available" },
                { status: 200 }
            );
        }
    } catch (error) {
        console.error("Error checking username uniqueness:", error);
        return Response.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}