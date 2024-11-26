"use client";

import { TTractor } from "@/lib/swr/hooks";
import { URLS } from "@/lib/urls/urls";
import {
  Box,
  Image as MantineImage,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { IconHeart } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React from "react";

const AddToWishList = () => {
  return (
    <Box className="absolute top-0.5 right-0.5">
      <Tooltip label="Add to wishlist" position="bottom-end">
        <IconHeart
          size={18}
          className="hover:fill-primary hover:text-primary"
        />
      </Tooltip>
    </Box>
  );
};

const ProductCard: React.FC<TTractor> = ({ product, ...props }) => {
  const router = useRouter();

  console.log(product);

  return (
    <div
      className="cursor-pointer flex flex-col gap-2  items-stretch"
      onClick={() =>
        router.push(
          URLS.PRODUCT_DETAIL(product.category.name, product.name, product.id) // ToDo: Fix this category
        )
      }
    >
      <Box className="relative">
        <MantineImage
          src={product.images && product.images.length ? product.images[0] : ""}
          alt={product.name}
          radius="md"
          h={150}
          w="auto"
          fit="contain"
        />
        <AddToWishList />
      </Box>
      <div>
        <Text fw={300}>{product.name}</Text>
        <Text className="text-primary" fw={500}>
          {product.currency} {product.price}
        </Text>
      </div>
    </div>
  );
};

export default ProductCard;
