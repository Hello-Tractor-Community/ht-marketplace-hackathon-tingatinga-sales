import { auth } from "@/lib/next-auth/auth";
import { prisma } from "@/lib/prisma/prisma";
import { SellerProfileSchema } from "@/lib/schema";
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
    const sellerProfileData = SellerProfileSchema.parse(body);

    const sellerProfile = await prisma.sellerProfile.create({
      data: { ...sellerProfileData, userId },
    });

    return NextResponse.json(sellerProfile, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(handleZodError(error), { status: 400 });
    }
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const filters = Object.fromEntries(searchParams);

    const sellerProfiles = await prisma.sellerProfile.findMany({
      where: {
        country: filters.country || undefined,
        city: filters.city || undefined,
      },
    });

    return NextResponse.json(sellerProfiles, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch seller profiles", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
