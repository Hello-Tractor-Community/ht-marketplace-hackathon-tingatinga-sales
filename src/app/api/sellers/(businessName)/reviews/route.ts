import { auth } from "@/lib/next-auth/auth";
import { prisma } from "@/lib/prisma/prisma";
import { ReviewSchema } from "@/lib/schema";
import { calculateAverageRating, calculateRatingBreakdown } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const businessName = url.searchParams.get("businessName");

  if (!businessName) {
    return new NextResponse("Business Name is required", { status: 400 });
  }

  try {
    // Find seller profile
    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { businessName },
    });

    if (!sellerProfile) {
      return new NextResponse("Seller profile not found", { status: 404 });
    }

    // Fetch reviews with aggregated rating data
    const reviewsData = await prisma.review.findMany({
      where: { sellerProfileId: sellerProfile.id },
      include: { user: true },
    });

    // Calculate review statistics
    const reviewStats = {
      totalReviews: reviewsData.length,
      averageRating: calculateAverageRating(reviewsData),
      ratingBreakdown: calculateRatingBreakdown(reviewsData),
    };

    return NextResponse.json(
      {
        reviews: reviewsData,
        stats: reviewStats,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch seller reviews", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  const url = new URL(req.url);
  const businessName = url.searchParams.get("businessName");

  if (!businessName) {
    return new NextResponse("Business Name is required", { status: 400 });
  }

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // Find seller profile
    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { businessName },
    });

    if (!sellerProfile) {
      return new NextResponse("Seller profile not found", { status: 404 });
    }

    const body = await req.json();
    const reviewData = ReviewSchema.parse(body);

    const newReview = await prisma.review.create({
      data: {
        rating: reviewData.rating,
        comment: reviewData.comment,
        user: { connect: { id: userId } },
        SellerProfile: { connect: { id: sellerProfile.id } },
      },
      include: { user: true },
    });

    return NextResponse.json(newReview, { status: 200 });
  } catch (error) {
    console.error("Failed to create seller review", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
