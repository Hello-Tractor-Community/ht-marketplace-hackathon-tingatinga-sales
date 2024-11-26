import { z } from "zod";

export function handleZodError(error: z.ZodError) {
  const errorMessages = error.errors.map((e) => ({
    path: e.path.join(" > "),
    message: e.message,
  }));
  console.error(
    "Zod Validation Errors:",
    JSON.stringify(errorMessages, null, 2)
  );
  return {
    error: "Validation failed",
    details: errorMessages,
  };
}

// Helper function to calculate average rating
export function calculateAverageRating(reviews: any[]) {
  if (reviews.length === 0) return 0;
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  return Number((totalRating / reviews.length).toFixed(1));
}

// Helper function to break down ratings
export function calculateRatingBreakdown(reviews: any[]) {
  const breakdown = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  reviews.forEach((review: { rating: 1 | 2 | 3 | 4 | 5 }) => {
    breakdown[review.rating]++;
  });

  return breakdown;
}
