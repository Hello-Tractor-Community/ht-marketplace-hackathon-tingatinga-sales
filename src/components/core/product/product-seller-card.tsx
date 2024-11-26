"use client";
import { URLS } from "@/lib/urls/urls";
import { Avatar, Badge, Box, Button, Divider, Flex, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconMessageCircle, IconUserCircle } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React from "react";
import ChatUI from "./messaging-ui";
import { useGetSellerProfileQuery } from "@/lib/swr/hooks";

interface ProductSellerCardProps {
  receiverId: string;
  businessName: string;
  receiverImage: string;
}

const ProductSellerCard: React.FC<ProductSellerCardProps> = ({
  receiverId,
  receiverImage,
  businessName,
}) => {
  const [openedChatDrawer, { open: openChatDrawer, close: closeChatDrawer }] =
    useDisclosure(false);
  const router = useRouter();
  const { sellerProfile } = useGetSellerProfileQuery(businessName);

  return (
    <Box mt={40}>
      <ChatUI
        opened={openedChatDrawer}
        close={closeChatDrawer}
        receiverId={receiverId}
        receiverName={businessName}
        receiverImage={receiverImage}
      />

      <Flex
        align="center"
        gap="sm"
        className="cursor-pointer"
        onClick={() => {
          router.push(URLS.SELLERS_PROFILE(businessName));
        }}
      >
        <Avatar size={48} radius="xl" src="https://i.pravatar.cc/800" />
        <div>
          <Text size="md" fw={500}>
            {businessName}
          </Text>
          <Badge color="green.4" size="sm" autoContrast>
            verified
          </Badge>
        </div>
      </Flex>
      <Text c="dimmed" mt={10}>
        {sellerProfile?.description}
      </Text>
      <Divider />
      <Flex
        align="start"
        direction={{ base: "column", md: "row" }}
        gap={{ base: "xs", md: "md" }}
        mt={10}
      >
        <Button
          autoContrast
          variant="subtle"
          leftSection={<IconUserCircle />}
          onClick={() => router.push(URLS.SELLERS_PROFILE(businessName))}
        >
          View Profile
        </Button>
        <Button
          autoContrast
          variant="subtle"
          leftSection={<IconMessageCircle />}
          onClick={openChatDrawer}
        >
          Make Inquiries
        </Button>
      </Flex>
    </Box>
  );
};

export default ProductSellerCard;
