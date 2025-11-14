import { dbConnect } from "@/lib/dbConnect";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();
    const { username, email, password } = body;
    console.log("Received signup:", { username, email, passwordPresent: !!password });

    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, message: "username, email and password are required" },
        { status: 400 }
      );
    }

    // Check username (only among verified users)
    const existingUserByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUserByUsername) {
      console.log("Username taken:", username);
      return NextResponse.json({ success: false, message: "Username already taken" }, { status: 400 });
    }

    // Check by email
    const existingUserByEmail = await UserModel.findOne({ email });
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

    
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        console.log("Email already registered & verified:", email);
        return NextResponse.json({ success: false, message: "Email already registered" }, { status: 400 });
      } else {
        // update existing unverified user
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verfiyCode = verificationCode; // keep same spelling as your model (or fix both to verifyCode)
        existingUserByEmail.verifyCodeExpire = expiryDate;
        await existingUserByEmail.save();
      }
    } else {
      // create new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new UserModel({
        username,
        password: hashedPassword,
        email,
        verifyCode: verificationCode, // again keep consistent with model
        verifyCodeExpire: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();
          }

    // Send verification email
    try {
      const sendVerification = await sendVerificationEmail(username, email, verificationCode);
      console.log("sendVerification result:", sendVerification);
      if (!sendVerification?.success) {
        return NextResponse.json({ success: false, message: sendVerification?.message || "Failed to send email" }, { status: 500 });
      }
    } catch (emailError) {
      console.error("sendVerificationEmail threw:", emailError);
      return NextResponse.json({ success: false, message: "Failed to send verification email" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Verification code sent to email" }, { status: 201 });

  } catch (error: unknown) {
    console.error("SERVER ERROR in /api/sign-up:", error);
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Internal server error" }, { status: 500 });
  }
}
