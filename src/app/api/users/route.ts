import { auth } from "@/lib/next-auth/auth";
import { prisma } from "@/lib/prisma/prisma";
import { SellerProfileSchema, userSchema } from "@/lib/schema";
import { handleZodError } from "@/lib/utils";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET(req: Request) {
  try {
    const session = await auth();

    const user = await prisma.user.findUnique({
      where: {
        id: session?.user.id,
      },
      include: {
        sellerProfile: {
          select: {
            id: true,
            businessName: true,
          },
        },
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch seller profiles", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();

    const user = await prisma.user.findUnique({
      where: {
        id: session?.user.id,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const body = await req.json();
    const parsedData = userSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json(handleZodError(parsedData.error), {
        status: 400,
      });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: session?.user.id,
      },
      data: parsedData.data,
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(handleZodError(error), { status: 400 });
    }
    return new NextResponse("Internal Error", { status: 500 });
  }
}
