import SellerReviews from "@/components/core/seller/seller-reviews";
import { prisma } from "@/lib/prisma/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const businessName = url.searchParams.get("businessName");

  if (!businessName) {
    return new NextResponse("Business Name is required", { status: 400 });
  }
  try {
    // Fetch the seller profile by businessName order by latest first
    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: {
        businessName, // Match the seller's business name
      },
      include: {
        products: true,
      },
    });

    const products = await prisma.product.findMany({
      where: {
        sellerId: sellerProfile?.id,
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!sellerProfile) {
      return new NextResponse("Seller profile not found", { status: 404 });
    }
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch seller profile", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
