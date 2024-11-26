"use client";
import { useGetProductReviewsQuery } from "@/lib/swr/hooks";
import { Flex, Rating, Text } from "@mantine/core";
import { useParams } from "next/navigation";

const ReviewsCard = () => {
  const { product } = useParams<{ product: string }>();
  const productId = product.split("-")[1];
  const { reviewData } = useGetProductReviewsQuery(productId);
  return (
    <Flex align="center" gap="xs">
      <Rating fractions={3} defaultValue={2} readOnly />
      <Text>({reviewData?.stats.totalReviews} reviews)</Text>
    </Flex>
  );
};

export default ReviewsCard;
