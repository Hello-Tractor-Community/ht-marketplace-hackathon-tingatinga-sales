"use client";
import { SellerTabs } from "@/components/core/seller/seller-tabs";
import { useGetSellerProfileQuery } from "@/lib/swr/hooks";
import {
  Badge,
  Box,
  Card,
  Container,
  Group,
  LoadingOverlay,
  Text,
  Title,
} from "@mantine/core";
import {
  IconRosetteDiscountCheck,
  IconRosetteDiscountCheckOff,
} from "@tabler/icons-react";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";

const SellerDetail = () => {
  const { businessName } = useParams<{ businessName: string }>();
  const { sellerProfile, isLoading, isError } =
    useGetSellerProfileQuery(businessName);

  if (isLoading) {
    return <LoadingOverlay visible loaderProps={{ type: "bars" }} />; // ToDo: Convert to skeleton loader
  }

  console.log(sellerProfile);

  if (isError) {
    return notFound();
  }

  return (
    <Container size={1400}>
      <Card shadow="xs" mb="lg" p="lg">
        {/* Seller Banner */}
        <div className="relative h-44 w-full rounded-t-md overflow-hidden mb-4">
          {sellerProfile?.bannerImageUrl ? (
            <Image
              src={sellerProfile?.bannerImageUrl}
              alt={sellerProfile?.businessName}
              fill
              className="object-cover"
            />
          ) : (
            <Box bg="gray.2" className="w-full h-full"></Box>
          )}
        </div>
        {/* Business Info */}
        <Group gap={"xs"}>
          <Title order={2}>{sellerProfile?.businessName}</Title>
          <Badge
            variant="transparent"
            color={sellerProfile?.isVerified ? "green" : "gray"}
            autoContrast
            leftSection={
              sellerProfile?.isVerified ? (
                <IconRosetteDiscountCheck />
              ) : (
                <IconRosetteDiscountCheckOff />
              )
            }
          >
            {sellerProfile?.isVerified ? "Verified " : "Unverified "}
            Seller
          </Badge>
        </Group>
        {sellerProfile?.tagline && (
          <Text c="dimmed" fs="italic" mb="md">
            {sellerProfile?.tagline}
          </Text>
        )}
        {sellerProfile?.description && (
          <Text mb="md">{sellerProfile?.description}</Text>
        )}
        <SellerTabs />
      </Card>
    </Container>
  );
};

export default SellerDetail;
