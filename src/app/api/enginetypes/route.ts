import { auth } from "@/lib/next-auth/auth";
import { prisma } from "@/lib/prisma/prisma";
import {
  categorySchema,
  engineTypeSchema,
  SellerProfileSchema,
} from "@/lib/schema";
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
    const engineTypeData = engineTypeSchema.parse(body);

    const engineTypes = await prisma.engineType.create({
      data: { ...engineTypeData },
    });

    return NextResponse.json(engineTypes, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(handleZodError(error), { status: 400 });
    }
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const engineTypes = await prisma.engineType.findMany({
      where: { verified: true },
    });
    return NextResponse.json(engineTypes, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch seller profiles", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
