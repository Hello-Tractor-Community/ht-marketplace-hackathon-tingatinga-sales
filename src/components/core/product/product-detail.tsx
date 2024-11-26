import {
  useGetTractorDetailQuery
} from "@/lib/swr/hooks";
import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  LoadingOverlay,
  rem,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconHeart,
  IconMapPin,
  IconShoppingBagCheck,
} from "@tabler/icons-react";
import { notFound, useParams } from "next/navigation";
import ContactSellerModal from "../modals/contact-seller";
import ProductReviewsCard from "../review/reviews-card";
import ImageCarousel from "./image-carousel";
import ProductBadges from "./product-badges";
import ProductSellerCard from "./product-seller-card";
import ProductTabs from "./product-tabs";
const ProductDetail = () => {
  const [
    openedContactModal,
    { open: openContactModal, close: closeContactModal },
  ] = useDisclosure(false);
  const { product } = useParams<{ product: string }>();
  const productId = product.split("-")[1];

  const { tractor, isLoading, isError } = useGetTractorDetailQuery(productId);

  if (isLoading) {
    return <LoadingOverlay visible loaderProps={{ type: "bars" }} />; // ToDo: Convert to skeleton loader
  }

  if (isError) {
    return notFound();
  }

  return (
    <Container size={1400}>
      <ContactSellerModal
        open={openedContactModal}
        onClose={closeContactModal}
        phoneNumber={"0715592343"}
        email={"dancoonmwangi@gmail.com"}
      />

      <Flex direction={{ base: "column", sm: "row" }} gap="xl">
        <ImageCarousel
          images={tractor?.product.images ?? []}
          productName={tractor?.product.name ?? "product"}
        />
        <Stack gap="xs" className="flex-grow">
          <ProductBadges />
          <Box>
            <Text size="xl" fw={600}>
              {tractor?.product.name}
            </Text>
            <Flex align="center">
              <IconMapPin style={{ width: rem(12), height: rem(12) }} />
              <Text ml={2} size="xs" c="dimmed" fw={600}>
                {tractor?.product.seller.city} -{" "}
                {tractor?.product.seller.region},{" "}
                {tractor?.product.seller.country}
              </Text>
            </Flex>
          </Box>
          <ProductReviewsCard />
          <Text size="xl" fw={600}>
            {tractor?.product.currency} {tractor?.product.price}
          </Text>
          <Text c="dimmed">{tractor?.product.description}</Text>
          <Divider />
          <Flex direction={{ base: "column", md: "row" }} gap="md">
            <Button
              autoContrast
              leftSection={<IconShoppingBagCheck />}
              onClick={openContactModal}
            >
              Contact Seller
            </Button>
            <Button variant="outline" autoContrast leftSection={<IconHeart />}>
              Add to Wishlist
            </Button>
          </Flex>
          <ProductSellerCard
            receiverId={tractor?.product.seller.user.id ?? ""}
            businessName={`${tractor?.product.seller.businessName}`}
            receiverImage={tractor?.product.seller?.user.image ?? ""}
          />
        </Stack>
      </Flex>
      <ProductTabs />
    </Container>
  );
};

export default ProductDetail;
