import { auth } from "@/lib/next-auth/auth";
import { prisma } from "@/lib/prisma/prisma";
import { categorySchema, SellerProfileSchema } from "@/lib/schema";
import { handleZodError } from "@/lib/utils";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const categoriesData = categorySchema.parse(body);

    const category = await prisma.category.create({
      data: { ...categoriesData },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(handleZodError(error), { status: 400 });
    }
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const categories = await prisma.category.findMany({
      where: { verified: true },
    });
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch seller profiles", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
