"use client"

import StatsCard from "@/components/core/card/stats-card";
import { LineChart } from "@mantine/charts";
import { data } from "./data";
import { Group, Text } from "@mantine/core";
import {
  IconHeartDollar,
  IconLayersSelected,
  IconShoppingBagPlus,
} from "@tabler/icons-react";
import React from "react";

const AdminDashboard = () => {
  return (
    <>
      <StatsCard
        icon={<IconLayersSelected />}
        statvalue="$562,554"
        title="Total Sales"
        percentageChange={1.01}
        weeklySales={[
          1000, 1500, 1200, 1800, 2000, 2200, 1900, 1289, 1257, 8892,
        ]} // Example weekly sales data
      />
      <StatsCard
        icon={<IconShoppingBagPlus />}
        statvalue="$202,554"
        title="Total Orders"
        percentageChange={-1.01}
        weeklySales={[200, 140, 160, 400, 50, 350, 325, 345, 566, 343, 281]} // Example weekly sales data
      />
      <StatsCard
        icon={<IconHeartDollar />}
        statvalue="$202,554"
        title="Total Earnings"
        percentageChange={1.01}
        weeklySales={[100, 150, 120, 90, 180, 190, 194, 200, 204, 206, 209]} // Example weekly sales data
      />
      <Group>
        <Text>Order Analytics</Text>
        <LineChart
          h={300}
          data={data}
          series={[{ name: "orders", label: "Total Sales" }]}
          dataKey="date"
          type="gradient"
          gradientStops={[
            { offset: 0, color: "red.6" },
            { offset: 20, color: "orange.6" },
            { offset: 40, color: "yellow.5" },
            { offset: 70, color: "lime.5" },
            { offset: 80, color: "cyan.5" },
            { offset: 100, color: "blue.5" },
          ]}
          strokeWidth={5}
          curveType="natural"
          yAxisProps={{ domain: [-25, 40] }}
          valueFormatter={(value) => `${value}°C`}
        />
    

      </Group>
    </>
  );
};

export default AdminDashboard;
