"use client";
import { useGetTractorDetailQuery } from "@/lib/swr/hooks";
import {
  Card,
  Grid,
  Group,
  Badge,
  Text,
  Title,
  List,
  Stack,
  Divider,
  Tooltip,
  Flex,
} from "@mantine/core";
import { IconInfoCircle, IconTool, IconGauge } from "@tabler/icons-react";
import { useParams } from "next/navigation";

const ProductSpecifications = () => {
  const { product } = useParams<{ product: string }>();
  const productId = product.split("-")[1];
  const { tractor } = useGetTractorDetailQuery(productId);
  // Example data

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group align="center" mb="md">
        <Title order={3}>Specifications</Title>
        {tractor?.condition === "new" && (
          <Badge size="md" color="teal">
            {tractor?.condition}
          </Badge>
        )}
      </Group>

      {/* Section 1: Basic Details */}
      <Divider label="Basic Details" labelPosition="center" mt="md" mb="md" />
      <Grid>
        <Grid.Col span={6}>
          <Stack gap="xs">
            <Text>
              <strong>Make:</strong> {tractor?.make}
            </Text>
            <Text>
              <strong>Model:</strong> {tractor?.model}
            </Text>
            <Text>
              <strong>Year:</strong> {tractor?.year}
            </Text>
            <Text>
              <strong>Condition:</strong> {tractor?.condition}
            </Text>
            <Text>
              <strong>Hours Used:</strong> {tractor?.hoursUsed}
            </Text>
          </Stack>
        </Grid.Col>

        <Grid.Col span={6}>
          <Stack gap="xs">
            <Text>
              <strong>Serial Number:</strong>{" "}
              <Tooltip label="Unique Identifier" withArrow>
                <span>{tractor?.serialNumber}</span>
              </Tooltip>
            </Text>
            <Text>
              <strong>Warranty:</strong> {tractor?.warranty ?? "N/A"}
            </Text>
          </Stack>
        </Grid.Col>
      </Grid>

      {/* Section 2: Performance Details */}
      <Divider
        label="Performance Details"
        labelPosition="center"
        mt="lg"
        mb="md"
      />
      <Grid>
        <Grid.Col span={6}>
          <Stack gap="xs">
            <Text>
              <IconGauge size={16} style={{ marginRight: 4 }} />
              <strong>Horse Power:</strong> {tractor?.horsePower} HP
            </Text>
            <Text>
              <strong>Fuel Capacity:</strong> {tractor?.fuelCapacity} L
            </Text>
            <Text>
              <strong>Max Speed:</strong> {tractor?.maxSpeed} km/h
            </Text>
          </Stack>
        </Grid.Col>

        <Grid.Col span={6}>
          <Stack gap="xs">
            <Text>
              <strong>Transmission Type:</strong> {tractor?.transmissionType}
            </Text>
            <Text>
              <strong>Wheel Type:</strong> {tractor?.wheelType}
            </Text>
            <Text>
              <strong>Operating Weight:</strong>{" "}
              {tractor?.operatingWeight
                ? `${tractor?.operatingWeight} kg`
                : "N/A"}
            </Text>
          </Stack>
        </Grid.Col>
      </Grid>

      {/* Section 3: Attachments */}
      <Divider label="Attachments" labelPosition="center" mt="lg" mb="md" />
      <Text>
        <strong>Attachments Compatible:</strong>
      </Text>
      <List spacing="xs" mt={2}>
        {tractor?.attachmentsCompatible.map((attachment, index) => (
          <List.Item key={index}>
            <Flex direction="row" className="items-center" gap={4}>
              <IconTool size={16} style={{ marginRight: 4 }} />
              <Text>{attachment}</Text>
            </Flex>
          </List.Item>
        ))}
        {tractor?.attachmentsCompatible.length === 0 && (
          <Text c="dimmed">No attachments available</Text>
        )}
      </List>
    </Card>
  );
};

export default ProductSpecifications;
