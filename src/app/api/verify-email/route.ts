import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import UserModel from '@/model/User';

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, code } = await request.json();
    const trimmedCode= code.trim()
    const user = await UserModel.findOne({
      username,
      verifyCode: trimmedCode,
      isVerified: false
    })
    console.log("Searching user:", { username, code });
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Invalid username or verification code"
      }, { status: 400 })
    }   
    
   
    const isCodeNotExpired = new Date(user.verifyCodeExpire) > new Date();
    
    if (!isCodeNotExpired) {
      return NextResponse.json({
        success: false,
        message: "Verification code has expired"
      }, { status: 400 })
    }
    if ( isCodeNotExpired){
      user.isVerified = true;
      await user.save();
      return NextResponse.json({
        success: true,
        message: "Email verified successfully"
      }, { status: 200 })
    }
    
  }catch (error) {
      console.log(error)
      return NextResponse.json({
        success: false,
        message: "An error occurred while verifying email"
      }, { status: 500 })
    }
  }
  


