import { productTypes } from "@/lib/constants";
import { auth } from "@/lib/next-auth/auth";
import { prisma } from "@/lib/prisma/prisma";
import { ProductSchema, TractorSchema } from "@/lib/schema";
import { handleZodError } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

// Helper function to create a typed error response
const createErrorResponse = (message: string, status: number) => {
  return NextResponse.json(
    { error: message },
    { status, headers: { "Content-Type": "application/json" } }
  );
};

// Separate the product data preparation for better maintainability
const prepareProductData = (
  data: z.infer<typeof TractorSchema>,
  sellerId: string
): Prisma.ProductCreateInput => ({
  category: { connect: { id: data.categoryId } },
  name: data.name,
  description: data.description,
  content: data.content,
  images: data.images,
  currency: data.currency,
  price: data.price,
  stockQuantity: data.stockQuantity,
  seller: { connect: { id: sellerId } },
  availabilityStatus: data.availabilityStatus,
});

// Separate the tractor data preparation
const prepareTractorData = (
  data: z.infer<typeof TractorSchema>,
  productId: string
): Prisma.TractorCreateInput => ({
  product: { connect: { id: productId } },
  engineType: { connect: { id: data.engineTypeId } },
  horsePower: data.horsePower,
  fuelCapacity: data.fuelCapacity,
  maxSpeed: data.maxSpeed,
  transmissionType: data.transmissionType,
  wheelType: data.wheelType,
  operatingWeight: data.operatingWeight,
  serialNumber: data.serialNumber,
  attachmentsCompatible: data.attachmentsCompatible,
  warranty: data.warranty,
  make: data.make,
  model: data.model,
  year: data.year,
  condition: data.condition,
  hoursUsed: data.hoursUsed,
});

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const session = await auth();
  const userId = session?.user?.id;
  const sellerId = session?.user?.sellerId;

  if (!userId) {
    return createErrorResponse("Unauthorized", 401);
  }

  if (!sellerId) {
    return createErrorResponse("Forbidden - Seller profile required", 403);
  }
  try {
    const body = await req.json();

    let result;

    if (productTypes.TRACTOR === searchParams.get("productType")) {
      // Validate against TractorSchema if it's a tractor
      const data = TractorSchema.parse(body);

      result = await prisma.$transaction(
        async (tx) => {
          const product = await tx.product.create({
            data: prepareProductData(data, sellerId),
          });

          const tractor = await tx.tractor.create({
            data: prepareTractorData(data, product.id),
          });

          return { tractor, product };
        },
        {
          timeout: 10000,
          isolationLevel: "Serializable",
        }
      );
    } else {
      // Validate against ProductSchema if it's a regular product
      const data = ProductSchema.parse(body);

      result = await prisma.product.create({
        data: {
          categoryId: data.categoryId,
          name: data.name,
          description: data.description,
          content: data.content,
          images: data.images,
          currency: data.currency,
          price: data.price,
          stockQuantity: data.stockQuantity,
          sellerId,
          availabilityStatus: data.availabilityStatus,
        },
      });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(handleZodError(error), { status: 400 });
    }
    console.error("Failed to create tractor", error);
    return new NextResponse(`Internal Error ${error}`, { status: 500 });
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
    if (error instanceof z.ZodError) {
      // Handle Zod validation errors
      return NextResponse.json(
        { error: error.errors.map((e) => e.message).join(", ") },
        { status: 400 }
      );
    }
    console.error("Failed to fetch seller profiles", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
