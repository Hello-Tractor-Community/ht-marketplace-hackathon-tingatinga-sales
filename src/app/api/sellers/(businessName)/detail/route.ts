import { prisma } from "@/lib/prisma/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const businessName = url.searchParams.get("businessName");

    if (!businessName) {
      return new NextResponse("Business Name is required", { status: 400 });
    }

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: {
        businessName: businessName,
      },
    });

    if (!sellerProfile) {
      return new NextResponse("Seller profile not found", { status: 404 });
    }
    return NextResponse.json(sellerProfile, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch seller profile", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
