// import { dbConnect } from "@/lib/dbConnect";
// import UserModel from "@/model/User";
// import bcrypt from "bcrypt";
// import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

// export async function POST(request: Request) {
//     await dbConnect();
//     try {
//         const { username, email, password } = await request.json();
//         const existingUserByUsername = await UserModel.findOne({
//             username,
//             isVerified: true
//         })
//         if (existingUserByUsername) {
//             return Response.json({
//                 success: false,
//                 message: "Username already taken"
//             }, { status: 400 })
//         }
//         const existingUserByEmail = await UserModel.findOne({
//             email,
//            })
//         const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
//            if (existingUserByEmail) {
//             if (existingUserByEmail.isVerified){
//                 return Response.json({
//                     success: false,
//                     message: "Email already registered"
//                 }, { status: 400 })
//             }else {
//                 const hashedPassword = await bcrypt.hash(password, 10);
//                 const expiryDate = new Date();
//                 expiryDate.setHours(expiryDate.getHours() + 1);
//                 existingUserByEmail.password = hashedPassword;
//                 existingUserByEmail.verfiyCode = verificationCode;
//                 existingUserByEmail.verifyCodeExpire = expiryDate;
//                 await existingUserByEmail.save();
//             }
          
//            }else {
//             const hashedPassword = await bcrypt.hash(password, 10);
//             const expiryDate = new Date();
//             expiryDate.setHours(expiryDate.getHours() + 1);

//             const newUser = new UserModel({
//                 username,
//                 password: hashedPassword,
//                 email,
//                 verfiyCode: verificationCode,
//                 verifyCodeExpire: expiryDate,
//                 isVerified: false,
//                 isAcceptingMessage: true,
//                 messages:[]
//            });
//            await newUser.save();          
            
//            }
//             const emailResponse =  await sendVerificationEmail( 
//                     username,
//                     email,
//                     verificationCode);

//             if (!emailResponse.success) {
//                 return Response.json({
//                     success: false,
//                     message: emailResponse.message
//                 }, { status: 500 })
//             }else {
//                 return Response.json({
//                     success: true,
//                     message: "Verification code sent to email"
//                 }, { status: 201 })
//             }
   
//     }catch (error) {
//         console.error("Error during sign-up:", error);
//         return Response.json({ 
//             success: false, 
//             message: "Internal server error" },
//             { status: 500 });
//     }
// }


import { dbConnect } from "@/lib/dbConnect";
import bcrypt from 'bcrypt';
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import UserModel from "@/model/User";
import { signUpSchema } from "@/schemas/signUpSchema";

export async function POST(request: Request) {
   await dbConnect()
   try {
    const body = await request.json();
    const parsed = signUpSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { success: false, message: parsed.error},
        { status: 400 }
      );
    }
    const { username, email, password } = parsed.data;
    const existingUserByUsername = await UserModel.findOne({
        username,
        isVerified: true
    })
    if (existingUserByUsername) {
        return Response.json({
            success: false,
            message: "Username already taken"
        }, { status: 400 })
    }
    const existingUserByEmail = await UserModel.findOne({
        email,
    })

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
     if (existingUserByEmail) {
        if (existingUserByEmail.isVerified) {
            return Response.json({
                success: false,
                message: "Email already registered"
            }, { status: 400 })
        }else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            existingUserByEmail.password = hashedPassword;
            existingUserByEmail.verfiyCode = verificationCode;
            existingUserByEmail.verifyCodeExpire = expiryDate;
            await existingUserByEmail.save();
            }
    }else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);

        const newUser = new UserModel({
            username,
            password: hashedPassword,
            email,
            verfiyCode: verificationCode,
            verifyCodeExpire: expiryDate,
            isVerified: false,
            isAcceptingMessage: true,
            messages:[]
       });
       await newUser.save();
     
    }
    const sendVerification = await sendVerificationEmail(
        username,
        email,
        verificationCode,
    );
    if (!sendVerification.success) {
        return Response.json({
            success: false,
            message: sendVerification.message,
          
        }, { status: 500 })
    }else {
        return Response.json({
            success: true,
            message: "Verification code sent to email"
                    }, { status: 201 })
        console.log("verification code sent to email")
    }

   } catch (error) {
    return Response.json({
        success: false,
        message: "Internal server error"
    }, { status: 500 })
    console.log(error);
    
   }
    
}