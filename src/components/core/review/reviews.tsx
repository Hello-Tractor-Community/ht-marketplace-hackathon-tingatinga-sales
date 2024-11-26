import { useGetProductReviewsQuery } from "@/lib/swr/hooks";
import {
  Box,
  Button,
  Divider,
  Flex,
  Progress,
  Rating,
  rem,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPencil, IconThumbDown, IconThumbUp } from "@tabler/icons-react";
import { useParams } from "next/navigation";
import AddProductReviewModal from "../modals/add-product-review";
import { ReviewCard } from "../seller/seller-reviews";

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

const Reviews = () => {
  const [
    openedAddProductReviewModal,
    { open: openAddProductReviewModal, close: closeAddProductReviewModal },
  ] = useDisclosure(false);

  const { product } = useParams<{ product: string }>();
  const productId = product.split("-")[1];
  const { reviewData } = useGetProductReviewsQuery(productId);

  return (
    <>
      <AddProductReviewModal
        open={openedAddProductReviewModal}
        onClose={closeAddProductReviewModal}
        productId={1}
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
            onClick={openAddProductReviewModal}
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

export default Reviews;
