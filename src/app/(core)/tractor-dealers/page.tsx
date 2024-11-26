"use client";

import dynamic from "next/dynamic";

import {
  Accordion,
  Alert,
  Badge,
  Button,
  Card,
  Container,
  Grid,
  Group,
  List,
  Modal,
  NumberInput,
  Rating,
  Select,
  SimpleGrid,
  Space,
  Stack,
  Switch,
  Tabs,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { DatePickerInput, TimeInput } from "@mantine/dates";
import {
  IconBell,
  IconClock,
  IconMapPin,
  IconMessage,
  IconPhone,
  IconSettings,
  IconStar,
  IconTool,
  IconTractor,
} from "@tabler/icons-react";
import { useState } from "react";

const Map = dynamic(() => import("@/components/map"), { ssr: false });

const dealerData = {
  CMC: [
    {
      city: "Nairobi",
      phones: ["722283433"],
      address: "Lusaka Rd",
      brand: "New Holland",
    },
    {
      city: "Nakuru",
      phones: ["722316821"],
      address: "Nakuru Kisumu Rd",
      brand: "New Holland",
    },
    {
      city: "Nanyuki",
      phones: ["727443226"],
      address: "Sagana Rd",
      brand: "New Holland",
    },
    {
      city: "Eldoret",
      phones: ["723256074"],
      address: "Eldoret Kisumu Rd",
      brand: "New Holland",
    },
    {
      city: "Kisumu",
      phones: ["722540558"],
      address: "Obote Rd",
      brand: "New Holland",
    },
    {
      city: "Mombasa",
      phones: ["720661972"],
      address: "Archbishop Makarios Rd",
      brand: "New Holland",
    },
  ],
  Mascor: [
    {
      city: "Eldoret",
      phones: ["254207602298"],
      address: "Uganda Rd",
      brand: "John Deere",
    },
    {
      city: "Kisumu",
      phones: ["254207602294"],
      address: "Obote Road, Kisumu",
      brand: "John Deere",
    },
    {
      city: "Nakuru",
      phones: ["254207602288"],
      address: "Old Nairobi Road, Nakuru",
      brand: "John Deere",
    },
    {
      city: "Narok",
      phones: ["254720935034"],
      address: "",
      brand: "John Deere",
    },
  ],
  CFAO: [
    {
      city: "Nakuru",
      phones: ["207604121"],
      address: "Town East, George Morara Rd, Nakuru",
      brand: "Case HI",
    },
    { city: "Kisumu", phones: ["719029707"], address: "", brand: "Case HI" },
    {
      city: "Nanyuki",
      phones: ["0719029462"],
      address: "Kenyatta Rd",
      brand: "Case HI",
    },
    {
      city: "CADS Motors (Kericho Toyota)",
      phones: ["254 708 698 899"],
      address: "Moi Highway",
      brand: "Case HI",
    },
    {
      city: "Sichey Automotive EA Ltd: Nairobi",
      phones: ["254 735 500 500", "254 768 989 407", "254 757 487 425"],
      address:
        "Pembe Plaza, Ground Floor Homa Bay Road/ Enterprise Road Junction Industrial Area",
      brand: "Case HI",
    },
    {
      city: "Terranova Automotive: (Bungoma Toyota)",
      phones: ["254 777 222 239"],
      address: "Webuye Malaba Road - Kandunyi",
      brand: "Case HI",
    },
    {
      city: "Uni- Truck World Ltd -Nakuru",
      phones: ["254 727 228 811", "254 734 228 811", "254 512216045"],
      address: "George Morara Avenue Next To Bhogals Toyota",
      brand: "Case HI",
    },
  ],
  FMD: [
    {
      city: "Nakuru",
      phones: ["722205538"],
      address: " Town East, Biashara George Morara Ave Nakuru, Kiambu",
      brand: "FMD",
    },
    {
      city: "Eldoret",
      phones: ["727509018"],
      address: "Lima Hse Kapseret, Kipkenyo, Kenyatta ave, Eldoret",
      brand: "FMD",
    },
  ],
};

const DealerLocator = () => {
  const [selectedDealer, setSelectedDealer] = useState<string | null>("all");
  const [selectedRegion, setSelectedRegion] = useState<string | null>("all");
  const [notifications, setNotifications] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [serviceRequestOpen, setServiceRequestOpen] = useState(false);
  const [selectedDealerData, setSelectedDealerData] = useState<any>(null);

  const regions = [
    ...new Set(
      Object.values(dealerData)
        .flat()
        .map((dealer) => dealer.city)
    ),
  ];

  const filteredDealers = Object.entries(dealerData)
    .flatMap(([company, dealers]) => {
      return dealers.map((dealer) => ({ ...dealer, company }));
    })
    .filter((dealer) => {
      if (selectedDealer !== "all" && dealer.company !== selectedDealer)
        return false;
      if (selectedRegion !== "all" && dealer.city !== selectedRegion)
        return false;
      return true;
    });

  const getBrandColor = (brand: string) => {
    switch (brand) {
      case "New Holland":
        return "blue";
      case "John Deere":
        return "green";
      case "Case HI":
        return "grape";
      case "FMD":
        return "pink";
      default:
        return "gray";
    }
  };

  const reviews = [
    {
      id: 1,
      rating: 5,
      comment: "Excellent service and knowledgeable staff",
      author: "John D.",
      date: "2024-03-15",
    },
    {
      id: 2,
      rating: 4,
      comment: "Quick response time and professional repairs",
      author: "Mary S.",
      date: "2024-03-10",
    },
    {
      id: 3,
      rating: 5,
      comment: "Great experience with maintenance service",
      author: "James K.",
      date: "2024-03-05",
    },
  ];

  const ServiceRequestForm = () => (
    <form>
      <Stack gap="md">
        <TextInput
          label="Full Name"
          placeholder="Enter your full name"
          required
        />
        <TextInput
          label="Contact Number"
          placeholder="Enter your phone number"
          required
        />
        <TextInput
          label="Equipment Model"
          placeholder="Enter tractor model"
          required
        />
        <NumberInput
          label="Equipment Age (years)"
          placeholder="Enter equipment age"
          min={0}
          max={50}
        />
        <Select
          label="Service Type"
          placeholder="Select service type"
          data={[
            { value: "repair", label: "Repair" },
            { value: "maintenance", label: "Maintenance" },
            { value: "inspection", label: "Inspection" },
            { value: "parts", label: "Parts Purchase" },
          ]}
          required
        />
        <DatePickerInput
          label="Preferred Date"
          placeholder="Pick preferred date"
          required
        />
        <TimeInput
          label="Preferred Time"
          placeholder="Pick preferred time"
          required
        />
        <Textarea
          label="Service Description"
          placeholder="Describe the service needed"
          minRows={3}
          required
        />
        <Button type="submit" fullWidth>
          Submit Request
        </Button>
      </Stack>
    </form>
  );

  const DealerProfile = ({ dealer }: { dealer: any }) => (
    <Tabs defaultValue="overview">
      <Tabs.List>
        <Tabs.Tab value="overview" leftSection={<IconTractor size={14} />}>
          Overview
        </Tabs.Tab>
        <Tabs.Tab value="services" leftSection={<IconTool size={14} />}>
          Services
        </Tabs.Tab>
        <Tabs.Tab value="reviews" leftSection={<IconStar size={14} />}>
          Reviews
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="overview" pt="xl">
        <SimpleGrid cols={2} spacing="xl">
          <div>
            <Title order={4}>About</Title>
            <Text size="sm" mt="md">
              Authorized {dealer.brand} dealer providing sales, service, and
              support for the entire range of {dealer.brand} agricultural
              equipment.
            </Text>

            <Title order={4} mt="xl">
              Location & Hours
            </Title>
            <List spacing="sm" mt="md">
              <List.Item icon={<IconMapPin size={16} />}>
                {dealer.address}
              </List.Item>
              <List.Item icon={<IconClock size={16} />}>
                Monday - Friday: 8:00 AM - 5:00 PM
                <br />
                Saturday: 9:00 AM - 1:00 PM
                <br />
                Sunday: Closed
              </List.Item>
              <List.Item icon={<IconPhone size={16} />}>
                {dealer.phones.map((phone: string, index: number) => (
                  <Text key={index}>{phone}</Text>
                ))}
              </List.Item>
            </List>
          </div>
          <div>
            <Map dealers={filteredDealers} height="300px" />
          </div>
          {/* <img 
            src="/api/placeholder/400/300"
            alt="Dealer location"
            style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
          /> */}
        </SimpleGrid>
      </Tabs.Panel>

      <Tabs.Panel value="services" pt="xl">
        <Accordion>
          <Accordion.Item value="sales">
            <Accordion.Control icon={<IconTractor size={16} />}>
              New Equipment Sales
            </Accordion.Control>
            <Accordion.Panel>
              <List>
                <List.Item>Full range of {dealer.brand} tractors</List.Item>
                <List.Item>Agricultural implements and attachments</List.Item>
                <List.Item>Financing options available</List.Item>
                <List.Item>Trade-in programs</List.Item>
              </List>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="service">
            <Accordion.Control icon={<IconSettings size={16} />}>
              Service & Maintenance
            </Accordion.Control>
            <Accordion.Panel>
              <List>
                <List.Item>Authorized warranty repairs</List.Item>
                <List.Item>Preventive maintenance</List.Item>
                <List.Item>Emergency repairs</List.Item>
                <List.Item>Digital diagnostic services</List.Item>
              </List>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="parts">
            <Accordion.Control icon={<IconTool size={16} />}>
              Parts & Accessories
            </Accordion.Control>
            <Accordion.Panel>
              <List>
                <List.Item>Genuine {dealer.brand} parts</List.Item>
                <List.Item>Fast order processing</List.Item>
                <List.Item>Parts warranty</List.Item>
                <List.Item>Technical support</List.Item>
              </List>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Tabs.Panel>

      <Tabs.Panel value="reviews" pt="xl">
        <Stack gap="lg">
          {reviews.map((review) => (
            <Card key={review.id} withBorder>
              <Group align="apart" mb="xs">
                <Group>
                  <IconMessage size={16} />
                  <Text fw={500}>{review.author}</Text>
                </Group>
                <Text size="sm" c="dimmed">
                  {review.date}
                </Text>
              </Group>
              <Rating value={review.rating} readOnly size="sm" mb="xs" />
              <Text size="sm">{review.comment}</Text>
            </Card>
          ))}
          <Button variant="light" leftSection={<IconMessage size={16} />}>
            Write a Review
          </Button>
        </Stack>
      </Tabs.Panel>
    </Tabs>
  );

  return (
    <Container size="lg" py="xl">
      <Title order={1} mb="md">
        Licensed Tractor Dealer Locator
      </Title>

      <Group mb="lg" grow>
        <Select
          data={[
            { value: "all", label: "All Dealers" },
            { value: "CMC", label: "CMC (New Holland)" },
            { value: "Mascor", label: "Mascor (John Deere)" },
            { value: "CFAO", label: "CFAO (Case HI)" },
            { value: "FMD", label: "FMD (Marsay Furguson)" },
          ]}
          value={selectedDealer}
          onChange={setSelectedDealer}
          placeholder="Select Dealer"
          allowDeselect={false}
        />

        <Select
          data={[
            { value: "all", label: "All Regions" },
            ...regions.map((region) => ({ value: region, label: region })),
          ]}
          value={selectedRegion}
          onChange={setSelectedRegion}
          placeholder="Select Region"
          allowDeselect={false}
        />

        <Switch
          label="Enable Notifications"
          checked={notifications}
          onChange={(event) => setNotifications(event.currentTarget.checked)}
          color="green"
          size="md"
          thumbIcon={
            <IconBell size="0.8rem" color={notifications ? "white" : "gray"} />
          }
        />
      </Group>

      {notifications && (
        <Alert
          icon={<IconBell size="1.1rem" />}
          title="Notifications Enabled"
          color="green"
          mb="lg"
        >
          You'll receive updates about dealer promotions and service reminders.
        </Alert>
      )}

      <Grid>
        {filteredDealers.map((dealer, index) => (
          <Grid.Col key={index} span={{ base: 12, md: 6, lg: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              {/* ... (previous card content remains the same) ... */}
              <Group align="apart" mb="md">
                <div>
                  <Title order={3}>{dealer.company}</Title>
                  <Badge
                    color={getBrandColor(dealer.brand)}
                    variant="light"
                    size="lg"
                  >
                    {dealer.brand}
                  </Badge>
                </div>
                <Rating value={4} readOnly />
              </Group>

              <List
                spacing="sm"
                size="sm"
                center
                icon={<IconTractor size={16} />}
              >
                <List.Item icon={<IconMapPin size={16} />}>
                  <Text fw={500}>{dealer.city}</Text>
                  <Text size="sm" c="dimmed">
                    {dealer.address}
                  </Text>
                </List.Item>

                <List.Item icon={<IconPhone size={16} />}>
                  {dealer.phones.map((phone, phoneIndex) => (
                    <Text key={phoneIndex}>
                      {phone}
                      {phoneIndex < dealer.phones.length - 1 && <br />}
                    </Text>
                  ))}
                </List.Item>

                <List.Item icon={<IconClock size={16} />}>
                  <Text size="sm">Mon-Fri: 8:00 AM - 5:00 PM</Text>
                </List.Item>
              </List>

              <Space h="lg" />

              <Text fw={500}>Services:</Text>
              <List size="sm" spacing="xs" center>
                <List.Item>New {dealer.brand} Sales</List.Item>
                <List.Item>Authorized Service Center</List.Item>
                <List.Item>Spare Parts</List.Item>
              </List>

              <Space h="md" />

              <Group mt="md" gap="sm">
                <Button
                  fullWidth
                  variant="light"
                  onClick={() => {
                    setSelectedDealerData(dealer);
                    setProfileOpen(true);
                  }}
                >
                  View Profile
                </Button>
                <Button
                  fullWidth
                  variant="filled"
                  onClick={() => {
                    setSelectedDealerData(dealer);
                    setServiceRequestOpen(true);
                  }}
                >
                  Request Service
                </Button>
              </Group>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      <Modal
        opened={profileOpen}
        onClose={() => setProfileOpen(false)}
        size="xl"
        title={selectedDealerData?.city}
      >
        {selectedDealerData && <DealerProfile dealer={selectedDealerData} />}
      </Modal>

      <Modal
        opened={serviceRequestOpen}
        onClose={() => setServiceRequestOpen(false)}
        title="Request Service"
        size="md"
      >
        <ServiceRequestForm />
      </Modal>
    </Container>
  );
};

export default DealerLocator;
