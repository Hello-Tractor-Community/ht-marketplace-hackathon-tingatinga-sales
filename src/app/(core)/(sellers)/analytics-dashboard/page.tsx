"use client";
import { Flex, Text } from "@mantine/core";
import React from "react";
import StatsCard from "@/components/core/card/stats-card";
import { URLS } from "@/lib/urls/urls";

import {
  IconMessage2Bolt,
  IconShoppingBagEdit,
  IconShoppingCartBolt,
  IconUsersGroup,
} from "@tabler/icons-react";
import VisitsBarChart from "../../../../components/core/barchart/bar-chart";

const Dashboard = () => {
  return (
    <>
      <Text fw={700} size="xl" mb={10}>
        Hi, Welcome back👋
      </Text>
      <Flex
        wrap={{ base: "wrap", md: "nowrap" }}
        justify={"space-between"}
        gap="md"
      >
        <StatsCard
          icon={<IconShoppingBagEdit />}
          statvalue="$10,000"
          title="Weekly Sales"
          percentageChange={15}
          weeklySales={[1000, 1500, 1200, 1800, 2000, 2200, 1900]}
          cardPage={URLS.SELLER_SALES} // Example weekly sales data
        />
        <StatsCard
          icon={<IconUsersGroup />}
          statvalue="1.35M"
          title="Weekly Views"
          percentageChange={-2}
          weeklySales={[200, 140, 160, 400, 50, 350, 325]}
          cardPage={URLS.SELLER_VIEWS} // Example weekly sales data
        />
        <StatsCard
          icon={<IconShoppingCartBolt />}
          statvalue="1.72M"
          title="Purchase orders"
          percentageChange={2.8}
          weeklySales={[100, 150, 120, 90, 180, 190, 194]}
          cardPage={URLS.SELLER_SALES} // Example weekly sales data
        />
        <StatsCard
          icon={<IconMessage2Bolt />}
          statvalue="234"
          title="Messages"
          percentageChange={3.6}
          weeklySales={[1000, 1100, 800, 900, 820, 700, 1500]}
          cardPage={URLS.SELLER_MESSAGES} // Example weekly sales data
        />
      </Flex>
      <Flex p={6} mt={30}>
        <VisitsBarChart />
      </Flex>
    </>
  );
};

export default Dashboard;
