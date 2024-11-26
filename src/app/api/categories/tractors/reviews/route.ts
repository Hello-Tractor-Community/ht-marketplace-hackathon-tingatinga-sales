import { auth } from "@/lib/next-auth/auth";
import { prisma } from "@/lib/prisma/prisma";
import { ReviewSchema } from "@/lib/schema";
import { calculateAverageRating, calculateRatingBreakdown } from "@/lib/utils";
import { NextResponse } from "next/server";
import { z } from "zod";

// Helper function to create a typed error response
const createErrorResponse = (message: string, status: number) => {
  return NextResponse.json(
    { error: message },
    { status, headers: { "Content-Type": "application/json" } }
  );
};

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const filters = Object.fromEntries(searchParams);

  const productId = filters.id;
  const session = await auth();
  const userId = session?.user?.id;

  if (!productId) {
    return new NextResponse("Business Name is required", { status: 400 });
  }

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // Find product
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    const body = await req.json();
    const reviewData = ReviewSchema.parse(body);

    const newReview = await prisma.review.create({
      data: {
        rating: reviewData.rating,
        comment: reviewData.comment,
        user: { connect: { id: userId } },
        product: { connect: { id: product?.id } },
      },
      include: { user: true },
    });

    return NextResponse.json(newReview, { status: 200 });
  } catch (error) {
    console.error("Failed to create seller review", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const filters = Object.fromEntries(searchParams);

    const productId = filters.id;

    let tractors;

    // Fetch a single product by ID
    tractors = await prisma.tractor.findUnique({
      where: {
        productId,
      },
    });

    if (!tractors) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const reviewsData = await prisma.review.findMany({
      where: {
        productId,
      },
      include: {
        user: true,
      },
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
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors.map((e) => e.message).join(", ") },
        { status: 400 }
      );
    }

    console.error("Failed to fetch reviews", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
