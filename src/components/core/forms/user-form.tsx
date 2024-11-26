"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "@mantine/form";
import { TextInput, Button, Group, Select, Flex, Box } from "@mantine/core";
import data from "@/data/country_dial_info.json";
import { useGetUserQuery } from "@/lib/swr/hooks";
import { useUpdateUserProfileMutation } from "@/lib/swr/hooks"; // Assume this is a new API function
import { toast } from "sonner";

const UserForm = () => {
  const { user, mutate } = useGetUserQuery(); // Include mutate for updating user data

  const form = useForm({
    initialValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      country: user?.country || "",
      address: user?.address || "",
      zipCode: user?.zipCode || "",
    },
    validate: {
      firstName: (value) => (value ? null : "First name is required"),
      lastName: (value) => (value ? null : "Last name is required"),
      email: (value) =>
        /^\S+@\S+\.\S+$/.test(value) ? null : "Invalid email address",
    },
  });

  useEffect(() => {
    form.setValues({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      country: user?.country || "",
      address: user?.address || "",
      zipCode: user?.zipCode || "",
    });
  }, [user]);

  const [query, setQuery] = useState("");
  const [dialCode, setDialCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredCountries = useMemo(() => {
    return query.trim()
      ? data.filter((country) =>
          country.name.toLowerCase().includes(query.toLowerCase())
        )
      : data;
  }, [query]);

  const handleCountryChange = (countryCode: string) => {
    const selectedCountry = data.find(
      (country) => country.code === countryCode
    );
    setDialCode(selectedCountry?.dial_code || "");
    form.setFieldValue("country", countryCode);
  };

  const handleSubmit = async (values: typeof form.values) => {
    setIsSubmitting(true);
    try {
      // Call backend API to update user profile
      const updatedUser = await useUpdateUserProfileMutation();

      // Optimistically update local user data
      if (user) {
        mutate({ ...user, ...updatedUser }, false);
      }

      // Optional: Show success notification
      toast.success("Profile updated successfully");
    } catch (error) {
      // Optional: Show error notification
      toast.error("Failed to update profile");
      console.error("Update failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box className="shadow p-3">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Flex
          direction={{ base: "column", md: "row" }}
          justify={"space-around"}
          gap={50}
        >
          <Flex direction="column" miw={300}>
            {/* Name Inputs */}
            <Flex gap={4}>
              <TextInput
                label="First Name"
                placeholder="Enter first name"
                {...form.getInputProps("firstName")}
              />
              <TextInput
                label="Last Name"
                placeholder="Enter last name"
                {...form.getInputProps("lastName")}
              />
            </Flex>

            {/* Email Input */}
            <TextInput
              mt="md"
              label="Email Address"
              placeholder="johndoe@gmail.com"
              {...form.getInputProps("email")}
            />

            {/* Country Select */}
            <Select
              mt="md"
              label="Country"
              placeholder="Select your country"
              data={filteredCountries.map((country) => ({
                value: country.code,
                label: `${country.flag} ${country.name}`,
              }))}
              onChange={(value) => handleCountryChange(value ?? "")}
              searchable
              onSearchChange={setQuery}
              error={form.errors.country}
            />

            {/* Dial Code Display */}
            {dialCode && (
              <TextInput mt="md" label="Dial Code" value={dialCode} disabled />
            )}

            {/* Address Input */}
            <TextInput
              mt="md"
              label="Address"
              placeholder="Enter your address"
              {...form.getInputProps("address")}
            />
          </Flex>

          {/* Right Column */}
          <Flex direction="column" miw={300}>
            {/* ZIP Code Input */}
            <TextInput
              mt="md"
              label="ZIP Code"
              placeholder="Enter ZIP Code"
              {...form.getInputProps("zipCode")}
            />

            {/* Company Input */}
            <TextInput
              mt="md"
              label="Company"
              placeholder="Your Company"
              {...form.getInputProps("company")}
            />
          </Flex>
        </Flex>

        {/* Action Buttons */}
        <Group mt="xl" className="flex justify-center items-center">
          <Button type="submit" loading={isSubmitting}>
            Submit
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              form.reset();
              setDialCode("");
            }}
            disabled={isSubmitting}
          >
            Reset
          </Button>
        </Group>
      </form>
    </Box>
  );
};

export default UserForm;
