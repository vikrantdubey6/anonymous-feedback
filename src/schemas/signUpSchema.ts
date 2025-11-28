import z from "zod";

export const usernameValidation = z
                                .string()
                                .min(2, "Username must be atleast 2 character")
                                .max(10, "Username must be no longer then 10 character")
                                .regex(/^[a-zA-Z0-9_]+$/ ,"Username must not contain specail charater")



export const signUpSchema = z.object(
    {
       username: usernameValidation,
       email: z.string()
               .email({message: "Invalid email address"}),
       password: z.string() 
                  .min(6,{message: "password must be atleast 6 character"})
    }
)                                    