import tractors from "@/data/tractors.json";
import {
  fuelTypesOptions,
  transmissionTypesOptions,
  wheelTypesOptions,
} from "@/lib/constants";
import { useFilterContext } from "@/lib/context/filters";
import { Option } from "@/lib/context/types";
import {
  Accordion,
  Box,
  Button,
  Divider,
  Drawer,
  MultiSelect,
  NumberInput,
  RangeSlider,
  rem,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { IconFilter, IconPhoto } from "@tabler/icons-react";
import {
  parseAsFloat,
  parseAsInteger,
  parseAsString,
  useQueryState,
  useQueryStates,
} from "nuqs";
import { useEffect, useState } from "react";

const ProductFilters = () => {
  const { setClear } = useFilterContext();
  const [opened, setOpened] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)"); // You can adjust this as per your requirement

  return (
    <>
      {isMobile ? (
        // Drawer for small screens
        <Drawer
          opened={opened}
          onClose={() => setOpened(false)}
          title="Product Filters"
          padding="md"
          size="sm"
        >
          <Stack gap="xs">
            <Accordion variant="contained" defaultValue={"general"}>
              <Accordion.Item value="general">
                <Accordion.Control
                  icon={
                    <IconPhoto
                      style={{
                        color: "var(--mantine-color-red-6",
                        width: rem(20),
                        height: rem(20),
                      }}
                    />
                  }
                >
                  General
                </Accordion.Control>
                <Accordion.Panel>
                  <GeneralFilters />
                </Accordion.Panel>
              </Accordion.Item>
              <Accordion.Item value="location">
                <Accordion.Control
                  icon={
                    <IconPhoto
                      style={{
                        color: "var(--mantine-color-red-6",
                        width: rem(20),
                        height: rem(20),
                      }}
                    />
                  }
                >
                  Location
                </Accordion.Control>
                <Accordion.Panel>
                  <LocationFilters />
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="price">
                <Accordion.Control
                  icon={
                    <IconPhoto
                      style={{
                        color: "var(--mantine-color-red-6",
                        width: rem(20),
                        height: rem(20),
                      }}
                    />
                  }
                >
                  Price
                </Accordion.Control>
                <Accordion.Panel>
                  <PriceFilter />
                </Accordion.Panel>
              </Accordion.Item>
              <Accordion.Item value="usage">
                <Accordion.Control
                  icon={
                    <IconPhoto
                      style={{
                        color: "var(--mantine-color-red-6",
                        width: rem(20),
                        height: rem(20),
                      }}
                    />
                  }
                >
                  Hours Of Usage
                </Accordion.Control>
                <Accordion.Panel>
                  <UsageFilter />
                </Accordion.Panel>
              </Accordion.Item>
              <Accordion.Item value="specifications">
                <Accordion.Control
                  icon={
                    <IconPhoto
                      style={{
                        color: "var(--mantine-color-red-6",
                        width: rem(20),
                        height: rem(20),
                      }}
                    />
                  }
                >
                  Specifications
                </Accordion.Control>
                <Accordion.Panel>
                  <SpecificationsFilters />
                </Accordion.Panel>
              </Accordion.Item>
              <Accordion.Item value="engine">
                <Accordion.Control
                  icon={
                    <IconPhoto
                      style={{
                        color: "var(--mantine-color-red-6",
                        width: rem(20),
                        height: rem(20),
                      }}
                    />
                  }
                >
                  Engine
                </Accordion.Control>
                <Accordion.Panel>
                  <EngineFilter />
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
            <Button onClick={() => setClear(true)}>Clear Filters</Button>
            <Button variant="filled" onClick={() => setOpened(false)}>
              Apply Filters
            </Button>
          </Stack>
        </Drawer>
      ) : (
        // Static filters for larger screens
        <Stack gap="xs" w={300}>
          <GeneralFilters />
          <LocationFilters />
          <PriceFilter />
          <UsageFilter />
          <SpecificationsFilters />
          <EngineFilter />
          <Button onClick={() => setClear(true)}>Clear Filters</Button>
        </Stack>
      )}

      {/* Toggle button to open the drawer on small screens */}
      {isMobile && !opened && (
        <Button
          onClick={() => setOpened(true)}
          size="md"
          // variant="light"
          style={{
            position: "fixed",
            bottom: 28,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
          }}
          leftSection={<IconFilter />}
        >
          Filters
        </Button>
      )}
    </>
  );
};

export default ProductFilters;

const GeneralFilters = () => {
  const { clear, setClear } = useFilterContext();

  // Query state
  const [product] = useQueryState("product", {
    defaultValue: "tractor",
  });
  const [make, setMake] = useQueryState("make", {
    clearOnDefault: true,
  });
  const [model, setModel] = useQueryState("model", {
    clearOnDefault: true,
  });

  // Local state for options
  const [makeOptions, setMakeOptions] = useState<Option[]>([]);
  const [modelOptions, setModelOptions] = useState<Option[]>([]);

  // Clear all filters
  useEffect(() => {
    if (clear) {
      setMake(null);
      setModel(null);
      setClear(false);
    }
  }, [clear, setMake, setModel, setClear]);

  // Initialize all available options
  useEffect(() => {
    const allModels = tractors.tractor_models.map((m) => ({
      label: m.model,
      value: m.model,
    }));
    setModelOptions(allModels);

    const allMakes = Array.from(
      new Set(tractors.tractor_models.flatMap((m) => m.makes))
    ).map((make) => ({
      label: make,
      value: make,
    }));
    setMakeOptions(allMakes);
  }, []);

  // Filter options based on selections
  const getFilteredMakeOptions = () => {
    if (!model) return makeOptions;

    const selectedModels = model.split(",");
    const filteredMakes = tractors.tractor_models
      .filter((m) => selectedModels.includes(m.model))
      .flatMap((m) => m.makes);

    return makeOptions.filter((opt) => filteredMakes.includes(opt.value));
  };

  const getFilteredModelOptions = () => {
    if (!make) return modelOptions;

    const selectedMakes = make.split(",");
    const filteredModels = tractors.tractor_models
      .filter((m) => m.makes.some((make) => selectedMakes.includes(make)))
      .map((m) => m.model);

    return modelOptions.filter((opt) => filteredModels.includes(opt.value));
  };

  const handleMakeChange = (values: string[]) => {
    const newMake = values.length ? values.join(",") : null;
    setMake(newMake);

    // Only reset model if the new make selection invalidates current model
    if (model) {
      const selectedModels = model.split(",");
      const validModels = tractors.tractor_models
        .filter((m) => m.makes.some((make) => values.includes(make)))
        .map((m) => m.model);

      const hasInvalidModel = selectedModels.some(
        (m) => !validModels.includes(m)
      );

      if (hasInvalidModel) {
        setModel(null);
      }
    }
  };

  const handleModelChange = (values: string[]) => {
    const newModel = values.length ? values.join(",") : null;
    setModel(newModel);

    // Only reset make if the new model selection invalidates current make
    if (make) {
      const selectedMakes = make.split(",");
      const validMakes = tractors.tractor_models
        .filter((m) => values.includes(m.model))
        .flatMap((m) => m.makes);

      const hasInvalidMake = selectedMakes.some((m) => !validMakes.includes(m));

      if (hasInvalidMake) {
        setMake(null);
      }
    }
  };

  return (
    <Box className="shadow-sm" p={20}>
      <Text fw={600} size="sm">
        General
      </Text>
      <Divider mb={8} />

      <MultiSelect
        label="Model"
        placeholder="Select model"
        value={model?.split(",") || []}
        data={getFilteredModelOptions()}
        clearable
        onClear={() => setModel(null)}
        onChange={handleModelChange}
      />

      <MultiSelect
        label="Make"
        placeholder="Select make"
        value={make?.split(",") || []}
        data={getFilteredMakeOptions()}
        clearable
        onClear={() => setMake(null)}
        onChange={handleMakeChange}
      />
    </Box>
  );
};

const SpecificationsFilters = () => {
  const { clear, setClear } = useFilterContext();
  const [fuelType, setFuelType] = useQueryState("fuelType");
  const [transmission, setTransmission] = useQueryState("transmission");
  const [driveType, setDriveType] = useQueryState("wheelType");

  useEffect(() => {
    if (clear) {
      setFuelType(null);
      setTransmission(null);
      setDriveType(null);
      setClear(false);
    }
  }, [clear, setFuelType, setTransmission, setDriveType]);

  return (
    <Box className="shadow-sm" p={20}>
      <Text fw={600} size="md">
        Specifications
      </Text>
      <Divider />
      <Select
        label="Transmission"
        placeholder="Select transmission"
        value={transmission}
        onChange={(value) =>
          setTransmission(value as "Manual" | "Automatic" | null)
        }
        data={transmissionTypesOptions}
      />
      <Select
        label="Wheel Type"
        placeholder="Select drive type"
        value={driveType}
        onChange={(value) => setDriveType(value as "2WD" | "4WD" | null)}
        data={wheelTypesOptions}
      />
      <Select
        label="Fuel Type"
        placeholder="Select fuel type"
        value={fuelType}
        onChange={(value) =>
          setFuelType(value as "Diesel" | "Gasoline" | "Electric" | null)
        }
        data={fuelTypesOptions}
      />
    </Box>
  );
};

const PriceFilter = () => {
  const { clear, setClear } = useFilterContext();
  const [minPrice, setMinPrice] = useQueryState("minPrice", parseAsFloat);
  const [maxPrice, setMaxPrice] = useQueryState("maxPrice", parseAsFloat);
  const priceRange: [number, number] | undefined =
    minPrice !== null && maxPrice !== null ? [minPrice, maxPrice] : undefined;

  useEffect(() => {
    if (clear) {
      setMinPrice(null);
      setMaxPrice(null);
      setClear(false);
    }
  }, [clear, setMinPrice, setMaxPrice]);

  return (
    <Box className="shadow-sm" p={20}>
      <Text fw={500} size="sm">
        Price Range
      </Text>
      <RangeSlider
        aria-label="Price Range"
        min={0}
        max={10000000}
        value={priceRange ?? [0, 10000000]}
        onChange={(value) => {
          const [min, max] = value;
          setMinPrice(min);
          setMaxPrice(max);
        }}
      />
    </Box>
  );
};

const EngineFilter = () => {
  const { clear, setClear } = useFilterContext();

  const [minEnginePower, setMinEnginePower] = useQueryState(
    "minEnginePower",
    parseAsInteger.withDefault(0)
  );
  const [maxEnginePower, setMaxEnginePower] = useQueryState(
    "maxEnginePower",
    parseAsInteger.withDefault(0)
  );

  useEffect(() => {
    if (clear) {
      setMinEnginePower(null);
      setMaxEnginePower(null);
      setClear(false);
    }
  }, [clear, setMinEnginePower, setMaxEnginePower]);

  return (
    <Box className="shadow-sm" p={20}>
      <NumberInput
        min={0}
        label="Min Engine Power (Hp)"
        value={minEnginePower}
        onChange={(value) => setMinEnginePower(value as number)}
        placeholder="e.g. 20 HP"
      />
      <NumberInput
        min={0}
        label="Max Engine Power (Hp)"
        value={maxEnginePower}
        onChange={(value) => setMaxEnginePower(value as number)}
        placeholder="e.g. 100 HP"
      />
    </Box>
  );
};

const UsageFilter = () => {
  const { clear, setClear } = useFilterContext();

  const [hourUsage, setHourUsage] = useQueryState(
    "hoursUsed",
    parseAsInteger.withDefault(0)
  );

  useEffect(() => {
    if (clear) {
      setHourUsage(null);
      setClear(false);
    }
  }, [clear, setHourUsage]);

  return (
    <Box className="shadow-sm" p={20}>
      <Text fw={600} size="md">
        Usage
      </Text>
      <Divider />
      <NumberInput
        min={0}
        label="Hour of Usage"
        value={hourUsage}
        onChange={(value) => setHourUsage(value as number)}
        placeholder="e.g. 100"
      />
    </Box>
  );
};

// Example data for countries, states, and cities
const countries = [
  { label: "Kenya", value: "kenya" },
  { label: "Nigeria", value: "nigeria" },
  { label: "South Africa", value: "south-africa" },
];

const states: { [key: string]: { label: string; value: string }[] } = {
  kenya: [
    { label: "Nairobi", value: "nairobi" },
    { label: "Mombasa", value: "mombasa" },
  ],
  nigeria: [
    { label: "Lagos", value: "lagos" },
    { label: "Abuja", value: "abuja" },
  ],
};

const cities: { [key: string]: { label: string; value: string }[] } = {
  nairobi: [
    { label: "Westlands", value: "westlands" },
    { label: "Kilimani", value: "kilimani" },
  ],
  lagos: [
    { label: "Ikeja", value: "ikeja" },
    { label: "Victoria Island", value: "victoria-island" },
  ],
};

const LocationFilters = () => {
  const { clear, setClear } = useFilterContext();

  const [location, setLocation] = useQueryStates({
    country: parseAsString.withDefault(""),
    state: parseAsString.withDefault(""),
    city: parseAsString.withDefault(""),
  });

  const form = useForm({
    initialValues: location,
  });

  const [stateOptions, setStateOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [cityOptions, setCityOptions] = useState<
    { label: string; value: string }[]
  >([]);

  // Update form when query params change
  useEffect(() => {
    form.setValues(location);
  }, [location]);

  // Fetch states based on selected country
  useEffect(() => {
    if (form.values.country) {
      setStateOptions(states[form.values.country] || []);
    }
  }, [form.values.country]);

  // Fetch cities based on selected state
  useEffect(() => {
    if (form.values.state) {
      setCityOptions(cities[form.values.state] || []);
    }
  }, [form.values.state]);

  useEffect(() => {
    if (clear) {
      setLocation({
        city: null,
        country: null,
        state: null,
      });
      setClear(false);
    }
  }, [clear, setLocation]);

  // Handle change and update the query state immediately
  const handleChange = (field: string, value: string) => {
    form.setFieldValue(field, value);
    setLocation({ ...location, [field]: value });
  };

  return (
    <Box className="shadow-sm" p={20}>
      <Text fw={600} size="md">
        Location
      </Text>
      <form>
        <Select
          label="Country"
          placeholder="Select country"
          data={countries}
          value={form.values.country}
          onChange={(value) => handleChange("country", value ?? "")}
          searchable
          clearable
        />
        <Select
          label="Region (State/Province) "
          placeholder="Select state"
          data={stateOptions}
          value={form.values.state}
          onChange={(value) => handleChange("state", value ?? "")}
          searchable
          clearable
          disabled={!form.values.country}
        />

        <Select
          label="City"
          placeholder="Select city"
          data={cityOptions}
          value={form.values.city}
          onChange={(value) => handleChange("city", value ?? "")}
          searchable
          clearable
          disabled={!form.values.state}
        />
      </form>
    </Box>
  );
};
