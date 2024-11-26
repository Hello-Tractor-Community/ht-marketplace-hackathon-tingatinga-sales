"use client";
import { TProduct } from "@/lib/context/types";
import {
  useGetSellerProductsQuery,
  useGetSellerProfileQuery,
} from "@/lib/swr/hooks";
import { URLS } from "@/lib/urls/urls";
import { Box, Button, Card, Flex, Text } from "@mantine/core";
import { Product } from "@prisma/client";
import { IconRvTruck } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React from "react";

export type ProductCardProps = TProduct;

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  images,
  name,
  category,
  currency,
  price,
  description,
}) => {
  const router = useRouter();
  return (
    <Card
      padding="lg"
      radius="sm"
      withBorder
      className="cursor-pointer"
      onClick={() => router.push(URLS.PRODUCT_DETAIL(category.name, name, id))}
    >
      <Flex align="center" gap="md">
        {/* Product Image */}
        <Image src={images[0]} width={200} height={200} alt="Product Name" />

        {/* Product Details */}
        <Box>
          <Text size="lg" fw={700}>
            {name}
          </Text>
          <Text size="md" c="dimmed" mt="xs">
            {`${currency} ${price}`}
          </Text>
          <Text size="sm" mt="md">
            {description}
          </Text>
        </Box>
      </Flex>
    </Card>
  );
};

const SellerProducts = () => {
  const { businessName } = useParams<{ businessName: string }>();
  const { sellerProfile } = useGetSellerProfileQuery(businessName);
  const { products } = useGetSellerProductsQuery(businessName);
  const { data: session } = useSession();
  const router = useRouter();
  return (
    <Flex direction="column" gap="sm" mt={12}>
      {session && session.user.sellerId === sellerProfile?.id && (
        <Button
          onClick={() => router.push(URLS.PRODUCT_CREATE)}
          leftSection={<IconRvTruck />}
        >
          Add New Product
        </Button>
      )}

      {(products ?? []).map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
      {products?.length === 0 && (
        <Text className="text-center" size="md" c="dimmed">
          No products found
        </Text>
      )}
    </Flex>
  );
};

export default SellerProducts;
