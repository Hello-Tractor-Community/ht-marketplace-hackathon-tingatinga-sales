"use client";
import React from "react";

import { Box, Button, Text, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";

const ForgotPassword = () => {
  const form = useForm({
    initialValues: { email: "" },
    validate: {
      email: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : "Invalid email"), // More robust email validation
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
            Forgot your password?
          </Title>
          <Text size="sm" c="dimmed" mt="xs" className="text-center">
            Please enter the email address associated with your account, and
            we&apos;ll email you a link to reset your password.
          </Text>
          <TextInput
            mt="md"
            label="Email"
            placeholder="johndoe@gmail.com"
            {...form.getInputProps("email")}
            required
          />

          <Button type="submit" fullWidth mt="md">
            Send Request
          </Button>
        </form>
      </Box>
    </div>
  );
};

export default ForgotPassword;
