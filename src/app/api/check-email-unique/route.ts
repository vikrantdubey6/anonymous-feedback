import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
// import { emailValidation } from "@/schemas/signUpSchema";
import z from "zod";


// const emailSchema = z.object({
//     email: emailValidation })

    const emailSchema = z.string().email();

    // console.log("here is the secret", emailSchema);
    


export async function GET(request: Request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return Response.json(
      { success: false, message: "Email is required" },
      { status: 400 }
    );
  }

   // ✅ Server-side email format validation using Zod
  const validation = emailSchema.safeParse(email);
  if (!validation.success) {
    return Response.json(
      { success: false, message: "Invalid email format" },
      { status: 400 }
    );
  }

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return Response.json(
        { success: true, message: "Email is Unique" },
        { status: 200 }
      );
    }

    if (user.isVerified) {
      return Response.json(
        { success: false, message: "Email already exists" },
        { status: 200 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Email exists but is not verified. You can sign up.",
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
