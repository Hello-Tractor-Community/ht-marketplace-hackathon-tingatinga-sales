"use client";
import React from "react";

import { Box, Button, PasswordInput, Text, Title } from "@mantine/core";
import { useForm } from "@mantine/form";

const UpdatePassword = () => {
  const form = useForm({
    initialValues: { password: "", confirmPassword: "" },
    validate: {
      password: (value) =>
        value.length < 6 ? "Password must be at least 6 characters long" : null,
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords did not match" : null,
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    console.log(values);
  };
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Box maw={500} mx="auto" p="lg" className="shadow">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Title order={2} size="md" className="text-center">
            Update your password?
          </Title>
          <Text size="sm" color="dimmed" mt="xs">
            Please enter your new and confirm password to update your password.
          </Text>
          <PasswordInput
            label="New Password"
            placeholder="Your new password"
            mt="md"
            required
            {...form.getInputProps("password")}
          />
          <PasswordInput
            mt="sm"
            label="Confirm Password"
            placeholder="Confirm your password"
            required
            {...form.getInputProps("confirmPassword")}
          />

          <Button type="submit" fullWidth mt="md">
            Update Password
          </Button>
        </form>
      </Box>
    </div>
  );
};

export default UpdatePassword;
