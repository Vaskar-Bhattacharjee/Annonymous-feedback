import React from 'react'
import { z } from 'zod'
import { dbConnect } from '@/lib/dbConnect';
import UserModel from '@/model/User';
export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, code } = await request.json();
    const user = await UserModel.findOne({
      username,
      verificationCode: code,
      isVerified: false
    })
    if (!user) {
      return Response.json({
        success: false,
        message: "Invalid username or verification code"
      }, { status: 400 })
    }   
    const isUserVerified =  user.isVerified = true;
    const isCodeNotExpired = new Date(user.verifyCodeExpire) > new Date();
    if (isUserVerified && isCodeNotExpired) {
      await user.save();
      return Response.json({
        success: true,
        message: "Email verified successfully"
      }, { status: 200 })
    } else if (!isCodeNotExpired) {
      return Response.json({
        success: false,
        message: "Verification code has expired"
      }, { status: 400 })
    } else {
      return Response.json({
        success: false,
        message: "verification failed"
      }, { status: 400 })
    }
  } catch (error) {
    console.error("Error during email verification:", error);
    return Response.json({
      success: false,
      message: "Error while verifying email"
    }, { status: 500 })
  }
} 

