"use client";
import React from "react";
import { Box, Button, Center, Flex, PasswordInput } from "@mantine/core";
import { useForm } from "@mantine/form";

const SecurityForm = () => {
  const form = useForm({
    initialValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
    validate: {
      oldPassword: (value) =>
        value.length < 6 ? "Password must be at least 6 characters long" : null,
      newPassword: (value, values) =>
        value.length < 6 ? "Password must be at least 6 characters long" : null,
      confirmPassword: (value, values) =>
        value !== values.newPassword ? "Passwords did not match" : null,
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    console.log(values);
  };

  return (
    <div className="flex items-center justify-center">
      <Box maw={500} mx="auto" p="lg" className="shadow w-[450px]">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <PasswordInput
            placeholder="Old password"
            mt="md"
            {...form.getInputProps("oldPassword")}
          />

          <PasswordInput
            placeholder="Your new password"
            mt="md"
            {...form.getInputProps("newPassword")}
          />
          <PasswordInput
            mt="sm"
            placeholder="Confirm new password"
            {...form.getInputProps("confirmPassword")}
          />
          <Flex align={"center"} justify={"flex-end"}>
            <Button type="submit" mt="md">
              Save changes
            </Button>
          </Flex>
        </form>
      </Box>
    </div>
  );
};

export default SecurityForm;
