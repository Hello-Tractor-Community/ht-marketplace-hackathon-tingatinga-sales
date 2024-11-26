import { prisma } from "@/lib/prisma/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { handleZodError } from "@/lib/utils";
import { z } from "zod";

const SignupSchema = z.object({
  email: z.string().email("Invalid email format"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: Request) {
  const body = await req.json();
  const { email, phoneNumber, firstName, lastName, password } =
    SignupSchema.parse(body);

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { phoneNumber: phoneNumber }],
      },
    });

    if (existingUser) {
      return new NextResponse("User already exists", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phoneNumber,
        password: hashedPassword,
      },
    });
    return new NextResponse(JSON.stringify(newUser), { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const result = handleZodError(error);
      return new NextResponse(JSON.stringify(result), { status: 400 });
    }
    return new NextResponse("Internal server error", { status: 500 });
  }
}
