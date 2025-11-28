import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {

  try {
    // 1. Create Transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // or Outlook / Yahoo etc.
      auth: {
        user: process.env.EMAIL_USER,   // your email
        pass: process.env.EMAIL_PASS,   // app password
      },
    });

    // 2. Convert React Email component → HTML
    const htmlContent = await render(
      VerificationEmail({ username, otp: verifyCode })
    );

    // 3. Send Email
    await transporter.sendMail({
      from: `"Mystery Message" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Verification Code",
      html: htmlContent,
    });

    return {
      success: true,
      message: "Verification email sent successfully",
    };

  } catch (error) {
    console.error("Error sending email", error);
    return { success: false, message: "Failed to send verification email" };
  }
}

/* 


import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(

    email: string,
    username: string,
    verifyCode: string

): Promise<ApiResponse>{
    try{
        await resend.emails.send({
            
            
   from: 'Acme <onboarding@resend.dev>',
  to: email,
  subject: 'Mystery message | Verification code',
  react: VerificationEmail({username, otp:verifyCode}),
});

         return {success: true, message: "verification email sent successfully"}
    }catch(emailError){
        console.error("Error sending verification email",emailError)
        return {success: false, message: "failed to send verification email"}
    }
}


*/