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
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const filters = Object.fromEntries(searchParams);
    const productId = filters.id || undefined;

    if (productId) {
      const tractor = await prisma.tractor.findUnique({
        where: {
          productId,
        },
        include: {
          product: {
            include: {
              category: true,
              seller: {
                include: {
                  user: true,
                },
              },
            },
          },
          engineType: true,
        },
      });

      if (!tractor) {
        return createErrorResponse("Tractor not found", 404);
      }

      return NextResponse.json(tractor, { status: 200 });
    }

    // Build where conditions for filtering
    const where: Prisma.TractorWhereInput = {};
    const conditions: Prisma.TractorWhereInput[] = [];

    if (filters.category) {
      conditions.push({
        product: {
          category: {
            name: { contains: filters.category, mode: "insensitive" },
          },
        },
      });
    }

    if (filters.model) {
      conditions.push({
        model: { contains: filters.model, mode: "insensitive" },
      });
    }

    if (filters.make) {
      conditions.push({
        make: { contains: filters.make, mode: "insensitive" },
      });
    }

    if (filters.minPrice || filters.maxPrice) {
      conditions.push({
        product: {
          price: {
            ...(filters.minPrice && { gte: parseInt(filters.minPrice) }),
            ...(filters.maxPrice && { lte: parseInt(filters.maxPrice) }),
          },
        },
      });
    }

    if (filters.hoursUsed) {
      conditions.push({
        hoursUsed: { lte: parseInt(filters.hoursUsed) },
      });
    }

    if (filters.transmissionType) {
      conditions.push({
        transmissionType: {
          contains: filters.transmissionType,
          mode: "insensitive",
        },
      });
    }

    if (filters.wheelType) {
      conditions.push({
        wheelType: { contains: filters.wheelType, mode: "insensitive" },
      });
    }

    if (filters.country) {
      conditions.push({
        product: {
          seller: {
            country: { contains: filters.country, mode: "insensitive" },
          },
        },
      });
    }

    if (filters.region) {
      conditions.push({
        product: {
          seller: {
            region: { contains: filters.region, mode: "insensitive" },
          },
        },
      });
    }

    if (filters.city) {
      conditions.push({
        product: {
          seller: {
            city: { contains: filters.city, mode: "insensitive" },
          },
        },
      });
    }

    if (filters.year) {
      conditions.push({
        year: { equals: parseInt(filters.year) },
      });
    }

    if (filters.condition) {
      conditions.push({
        condition: { equals: filters.condition },
      });
    }

    // Only add OR condition if there are filters
    if (conditions.length > 0) {
      where.AND = conditions;
    }

    const tractors = await prisma.tractor.findMany({
      where,
      include: {
        product: {
          include: {
            category: true,
            seller: {
              include: {
                user: true,
              },
            },
          },
        },
        engineType: true,
      },
      orderBy: {
        product: {
          createdAt: "desc",
        },
      },
    });

    return NextResponse.json(tractors, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors.map((e) => e.message).join(", ") },
        { status: 400 }
      );
    }

    console.error("Failed to fetch tractors", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
