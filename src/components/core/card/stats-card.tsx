"use client";
import { Flex, Group, Stack, Text, ThemeIcon } from "@mantine/core";
import { IconArrowUpRight, IconArrowDownRight } from "@tabler/icons-react";
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Register Chart.js components
ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

interface StatCardProps {
  icon: React.ReactNode;
  statvalue: string;
  title: string;
  percentageChange: number;
  weeklySales: number[]; // Array of 7 numbers representing sales for each day
  cardPage?:string;
}

const StatsCard: React.FC<StatCardProps> = ({
  icon,
  statvalue,
  title,
  percentageChange,
  weeklySales,
  cardPage,
}) => {
  const router = useRouter();

  const ChangeIcon =
    percentageChange > 0 ? IconArrowUpRight : IconArrowDownRight;

  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], // Days of the week
    datasets: [
      {
        label: "Sales ($)", // Tooltip label
        data: weeklySales,
        borderColor: percentageChange > 0 ? "teal" : "red",
        backgroundColor: "rgba(0, 0, 0, 0)",
        borderWidth: 2,
        pointRadius: 0, // Hide points
        pointHoverRadius: 5, // Show points on hover
        tension: 0.3, // Smooth curve
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide legend
      },
      tooltip: {
        enabled: true, // Enable tooltips to show sales on hover
        callbacks: {
          label: (tooltipItem: any) =>
            `Sales: $${tooltipItem.raw}`, // Tooltip text for sales
        },
      },
    },
    scales: {
      x: {
        display: false, // Completely hide X-axis
      },
      y: {
        display: false, // Completely hide Y-axis
      },
    },
  };

  return (
    <Stack
      gap="sm"
      align="center"
      m={6}
      p={6}
      style={{ width: "100%", maxWidth: 350 ,cursor:"pointer"}}
      className="rounded-xl border hover:shadow-lg transition-shadow"
      onClick={() => cardPage && router.push(cardPage)}
    >
      <Flex justify={"space-between"} style={{ width: "100%" }}>
        {/* Dynamic Icon */}
        <ThemeIcon size="xl" radius="md" variant="light" color="teal">
          {icon}
        </ThemeIcon>
        {/* Percentage Change */}
        <Group gap={4} align="center">
          <ThemeIcon
            color="gray"
            variant="light"
            style={{
              color:
                percentageChange > 0
                  ? "var(--mantine-color-teal-6)"
                  : "var(--mantine-color-red-6)",
            }}
            size={30}
            radius="md"
          >
            <ChangeIcon size="1.2rem" stroke={1.5} />
          </ThemeIcon>
          <Text
            size="sm"
            c={percentageChange > 0 ? "teal" : "red"}
            fw={500}
          >
            {percentageChange}%
          </Text>
        </Group>
        <Link href={cardPage ?? ""}/>
      </Flex>

      <Flex justify={"space-between"} style={{ width: "100%" }} align={"center"}>
        {/* Title and Stat Value */}
        <Flex style={{ width: "40%" }} direction={"column"}>
          <Text size="sm" fw={600} c="dimmed" mb={9}>
            {title}
          </Text>
          <Text size="xl" fw={700}>
            {statvalue}
          </Text>
        </Flex>

        {/* Weekly Sales Graph */}
        <Flex justify={"flex-end"} style={{ width: "30%", height: 100 }}>
          <Line data={chartData} options={chartOptions} />
        </Flex>
      </Flex>
    </Stack>
  );
};

export default StatsCard;
