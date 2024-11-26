"use client";
import { TReviewData, useGetSellerReviewsQuery } from "@/lib/swr/hooks";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Group,
  Progress,
  Rating,
  rem,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPencil, IconThumbDown, IconThumbUp } from "@tabler/icons-react";
import { format } from "date-fns";
import { useParams } from "next/navigation";
import React from "react";
import AddSellerReviewModal from "../modals/add-seller-review";

const LikeReviewButton = () => {
  const iconStyle = { width: rem(18), height: rem(18) };

  return (
    <Button variant="subtle" leftSection={<IconThumbUp style={iconStyle} />}>
      123
    </Button>
  );
};

const DislikeReviewButton = () => {
  const iconStyle = { width: rem(18), height: rem(18) };

  return (
    <Button variant="subtle" leftSection={<IconThumbDown style={iconStyle} />}>
      13
    </Button>
  );
};

type ReviewCardProps = TReviewData["reviews"][number];

export const ReviewCard: React.FC<ReviewCardProps> = ({
  user,
  createdAt,
  rating,
  comment,
}) => {
  return (
    <Flex p={{ base: 0, md: 12 }} py={{ base: 10, md: 10 }} gap="lg">
      <Flex direction="column" align="center">
        <Avatar size={50} src={user.image} />
        <Text fw={500}>{`${user.firstName} ${user.lastName}`}</Text>
        <Text c="dimmed" size="xs">
          {format(createdAt, "PPPp")}
        </Text>
      </Flex>
      <Flex direction="column" gap="xs" className="flex-grow">
        <Rating fractions={3} value={rating} readOnly />
        <Text size="md" fw={400}>
          {comment}
        </Text>
        <Group gap="xs">
          <LikeReviewButton />
          <DislikeReviewButton />
        </Group>
      </Flex>
    </Flex>
  );
};

const SellerReviews = () => {
  const [
    openedAddSellerReviewModal,
    { open: openAddSellerReviewModal, close: closeAddSellerReviewModal },
  ] = useDisclosure(false);

  const { businessName } = useParams<{ businessName: string }>();
  const { reviewData } = useGetSellerReviewsQuery(businessName);

  return (
    <>
      <AddSellerReviewModal
        open={openedAddSellerReviewModal}
        onClose={closeAddSellerReviewModal}
        sellerId={0}
      />
      <Flex
        direction={{ base: "column", md: "row" }}
        align="center"
        py={10}
        gap="lg"
        w="100%"
      >
        <Stack gap="xs" className="text-center w-full md:w-1/3" align="center">
          <Text size="sm">Average Rating</Text>
          <Text size="xl" w={{ base: "full", md: "100%" }}>
            {reviewData?.stats.averageRating}/5
          </Text>
          <Rating
            fractions={3}
            value={reviewData?.stats.averageRating}
            readOnly
          />
          <Text size="xs">({reviewData?.stats.totalReviews ?? 0} reviews)</Text>
        </Stack>

        <Stack gap="xs" className="w-full md:w-1/3" align="stretch">
          {[
            {
              label: "5 Star",
              value:
                (reviewData?.stats.ratingBreakdown[5] ?? 0) /
                (reviewData?.stats.totalReviews ?? 1),
              count: reviewData?.stats.ratingBreakdown[5] ?? 0,
            },
            {
              label: "4 Star",
              value:
                (reviewData?.stats.ratingBreakdown[4] ?? 0) /
                (reviewData?.stats.totalReviews ?? 1),
              count: reviewData?.stats.ratingBreakdown[4] ?? 0,
            },
            {
              label: "3 Star",
              value:
                (reviewData?.stats.ratingBreakdown[3] ?? 0) /
                (reviewData?.stats.totalReviews ?? 1),
              count: reviewData?.stats.ratingBreakdown[3] ?? 0,
            },
            {
              label: "2 Star",
              value:
                (reviewData?.stats.ratingBreakdown[2] ?? 0) /
                (reviewData?.stats.totalReviews ?? 1),
              count: reviewData?.stats.ratingBreakdown[2] ?? 0,
            },
            {
              label: "1 Star",
              value:
                (reviewData?.stats.ratingBreakdown[1] ?? 0) /
                (reviewData?.stats.totalReviews ?? 1),
              count: reviewData?.stats.ratingBreakdown[1] ?? 0,
            },
          ].map((item, index) => (
            <Flex key={index} align="center" gap={2} w="full">
              <Text flex="0 0 auto">{item.label}</Text>
              <Progress flex="1" value={item.value} />
              <Text flex="0 0 auto">{item.count}</Text>
            </Flex>
          ))}
        </Stack>

        <Stack className="w-full md:w-1/3" align="center">
          <Button
            variant="light"
            leftSection={<IconPencil />}
            onClick={openAddSellerReviewModal}
          >
            Write your review
          </Button>
        </Stack>
      </Flex>

      <Divider my={8} />

      {reviewData && reviewData.reviews.length === 0 && (
        <Text className="text-center" c="dimmed" size="md">
          No reviews yet
        </Text>
      )}

      {(reviewData?.reviews ?? []).map((review, index) => (
        <Box key={index}>
          <ReviewCard {...review} />
          <Divider />
        </Box>
      ))}
    </>
  );
};

export default SellerReviews;
