import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/Verification-email";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    username: string, 
    email: string, 
    verifyCode: string): Promise<ApiResponse<null>> {
        try {
            await resend.emails.send({
                from: 'Acme <onboarding@resend.dev>',
                to: email,
                subject: 'Verify your email',
                react: VerificationEmail({ username, otp: verifyCode }),
            });
            return {
                success: true,
                message: "Verification email sent successfully"
            };
        } catch (error) {
            console.error("Error sending verification email:", error);
            return {
                success: false,
                message: "Failed to send verification email"
            };
        }
    }