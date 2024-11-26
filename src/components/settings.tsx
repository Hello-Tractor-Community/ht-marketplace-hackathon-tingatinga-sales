import { Card, Text, Group, Flex, Switch } from "@mantine/core";
import React, { useState } from "react";

const Settings = () => {
  // Define settings in a structured format
  const [settings, setSettings] = useState([
    {
      category: "Activity",
      description:
        "Manage your activity notifications. Customize what you'd like to be notified about.",
      options: [
        { id: 1, label: "Email me when someone comments on my product", enabled: false },
        { id: 2, label: "Email me when someone adds my product to cart", enabled: false },
        { id: 3, label: "Email me when someone likes my product", enabled: true },
      ],
    },
    {
      category: "Promotions",
      description:
        "Stay updated on promotions and listings. Select the notifications you'd like to receive.",
      options: [
        { id: 4, label: "Notify me on dealers promotions", enabled: false },
        { id: 5, label: "Email me on new listings", enabled: true },
        { id: 6, label: "Weekly product updates", enabled: false },
      ],
    },
  ]);

  // Handle switch toggle
  const handleToggle = (categoryIndex: number, optionId: number) => {
    setSettings((prevSettings) =>
      prevSettings.map((category, idx) =>
        idx === categoryIndex
          ? {
              ...category,
              options: category.options.map((option) =>
                option.id === optionId
                  ? { ...option, enabled: !option.enabled }
                  : option
              ),
            }
          : category
      )
    );
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      {settings.map((category, categoryIndex) => (
        <div key={categoryIndex}>
          <Flex direction={{base:"column", md:"row"}} gap="sm" justify={"space-between"} mt="lg">
            <Flex direction={"column"} >
              <Text fw={600}>{category.category}</Text>
              <Text c="dimmed">{category.description}</Text>
            </Flex>
            <Card shadow="sm" padding="lg" radius="md" withBorder className="md:w-[500px]">
              {category.options.map((option) => (
                <Flex key={option.id} justify="space-between" align="center" mt="md" gap={6}>
                  <Text>{option.label}</Text>
                  <Switch
                    size="md"
                    onLabel="YES"
                    offLabel="NO"
                    checked={option.enabled}
                    onChange={() => handleToggle(categoryIndex, option.id)}
                  />
                </Flex>
              ))}
            </Card>
          </Flex>
        </div>
      ))}
    </Card>
  );
};

export default Settings;
