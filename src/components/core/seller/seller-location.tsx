import { useGetSellerProfileQuery } from "@/lib/swr/hooks";
import { Flex, Stack, Text } from "@mantine/core";
import {
  IconBuilding,
  IconGlobe,
  IconMail,
  IconMap,
  IconMapPin
} from "@tabler/icons-react";
import { useParams } from "next/navigation";

const SellerLocation = () => {
  const { businessName } = useParams<{ businessName: string }>();
  const { sellerProfile } = useGetSellerProfileQuery(businessName);

  return (
    <Stack gap="sm" mt={12} p={4}>
      <Text size="lg" fw={500} mb={4}>
        Store Location
      </Text>

      <Flex direction="row" align="center" gap="xs">
        <IconMapPin className="text-primary" />
        <Text fw={500}>Address: </Text>
        <Text> {sellerProfile?.address ?? "-"}</Text>
      </Flex>

      <Flex direction="row" align="center" gap="xs">
        <IconBuilding className="text-primary" />
        <Text fw={500}>City: </Text>
        <Text> {sellerProfile?.city ?? "-"}</Text>
      </Flex>

      <Flex direction="row" align="center" gap="xs">
        <IconMap className="text-primary" />
        <Text fw={500}>Region (State): </Text>
        <Text> {sellerProfile?.region ?? "-"}</Text>
      </Flex>

      <Flex direction="row" align="center" gap="xs">
        <IconGlobe className="text-primary" />
        <Text fw={500}>Country: </Text>
        <Text> {sellerProfile?.country ?? "-"}</Text>
      </Flex>

      <Flex direction="row" align="center" gap="xs">
        <IconMail className="text-primary" />
        <Text fw={500}>Postal Code: </Text>
        <Text> {sellerProfile?.postalCode ?? "-"}</Text>
      </Flex>
    </Stack>
  );
};

export default SellerLocation;
