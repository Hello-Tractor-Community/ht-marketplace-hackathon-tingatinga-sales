import React from "react";
import { Avatar, Box, Flex, Text } from "@mantine/core";

const ProductInquryCard = () => {
  return (
    <Box p={10} className="border-b">
      <Flex gap="xs" align="center">
        <Avatar size={38} radius="xl" src="https://i.pravatar.cc/800" />
        <div className="flex-grow">
          <Flex justify="space-between">
            <Text size="sm">Customer&apos;s Name</Text>
            <Text c="dimmed" size="xs">
              12th June, 2021 4:30 PM
            </Text>
          </Flex>
          <Text c="dimmed">Seller Description</Text>
        </div>
      </Flex>
    </Box>
  );
};

export default ProductInquryCard;
