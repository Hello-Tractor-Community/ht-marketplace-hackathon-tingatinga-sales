"use client";

import {
  useCreateProductReviewMutation,
  useCreateSellerReviewMutation,
} from "@/lib/swr/hooks";
import { Button, Rating, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useParams } from "next/navigation";
import React from "react";
import { toast } from "sonner";

interface AddReviewFormProps {
  itemId: number;
  itemType: "product" | "seller";
  closeModal: () => void;
}

const AddReviewForm: React.FC<AddReviewFormProps> = ({
  itemId,
  itemType,
  closeModal,
}) => {
  const { businessName } = useParams<{ businessName: string }>();
  const { product } = useParams<{ product: string }>();
  const productId = product?.split("-")[1];

  const {
    review,
    isMutating: isSellerMutating,
    trigger: triggerSellerReview,
  } = useCreateSellerReviewMutation(businessName);

  const {
    review: productReview,
    isMutating: isProductMutating,
    trigger: triggerProductReview,
  } = useCreateProductReviewMutation(productId);

  const isMutating =
    itemType === "seller" ? isSellerMutating : isProductMutating;

  const form = useForm({
    initialValues: { comment: "", rating: 0 },
    validate: {
      comment: (value) => (value ? null : "Review text is required"),
      rating: (value) =>
        value >= 1 && value <= 5 ? null : "Rating must be between 1 and 5",
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    (itemType === "seller"
      ? triggerSellerReview({ ...values, sellerId: itemId })
      : triggerProductReview({ ...values, productId: itemId })
    )
      .then(() => {
        toast.success("Review submitted successfully");
        form.reset();
      })
      .catch(() => {
        toast.error("Failed to submit review");
      });
    closeModal();
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Rating
        {...form.getInputProps("rating")}
        count={5}
        mt="md"
        size="lg"
        onChange={(value) => form.setFieldValue("rating", value || 0)}
      />
      <Textarea
        {...form.getInputProps("comment")}
        label="Review"
        placeholder="Write your review here..."
        mt="md"
        required
      />

      <Button type="submit" fullWidth mt="md">
        Submit Review
      </Button>
    </form>
  );
};

export default AddReviewForm;
