import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerficationEmail";
import { success } from "zod";

export async function POST(request: request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();
    const existingUserVerificationByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerificationByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        {
          status: 400,
        }
      );
    }

    const existingUserVerificationByEmail = await UserModel.findOne({ email })
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString() 

    if(existingUserVerificationByEmail) {
       if(existingUserVerificationByEmail.isVerified){
         return Response.json({
            success:false, 
            message:"Email already exists"
        },{status:400})
       } else {
        const hashedPassword = await bcrypt.hash(password, 10)
        existingUserVerificationByEmail.password = hashedPassword;
        existingUserVerificationByEmail.verifyCode = verifyCode;
        existingUserVerificationByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
        await existingUserVerificationByEmail.save()
       }

    }else{
      const hashedpassword =  await bcrypt.hash(password,10)

      const expiryDate = new Date()
      expiryDate.setHours(expiryDate.getHours()+1)
      const newUser = new UserModel({
        username,
            email,
            password:hashedpassword,
            verifyCode,
            verifyCodeExpiry:expiryDate,
            isVerified:false,
            isAcceptingMessage:true,
            messages: [],
      })

      await newUser.save()
    }

    const emailResponse = await sendVerificationEmail(
        email, 
        username,
        verifyCode
    )

    if(!emailResponse.success){
        return Response.json({
            success:false, 
            message:emailResponse.message
        },{status:500})
    }
     return Response.json({
            success:true, 
            message:"User registered successfully, please verify your email"
        },{status:201})

  } catch (error) {
    console.error("Error registering user", error);
    return Response.json(
      {
        success: false,
        message: "error registering user",
      },
      {
        status: 500,
      }
    );
  }
}
