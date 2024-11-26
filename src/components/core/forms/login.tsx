"use client";

import { URLS } from "@/lib/urls/urls";
import {
  Anchor,
  Box,
  Button,
  Checkbox,
  Flex,
  Loader,
  PasswordInput,
  TextInput
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const Login = () => {
  const router = useRouter();
  const { status } = useSession();

  const form = useForm({
    initialValues: {
      identifier: "",
      password: "",
      rememberMe: false,
    },
    validate: {
      identifier: (value) =>
        /^\S+@\S+\.\S+$/.test(value) || /^\d{10,15}$/.test(value)
          ? null
          : "Enter a valid email or phone number",
      password: (value) => (value ? null : "Password is required"),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        emailOrPhoneNumber: values.identifier,
        password: values.password,
      });

      if (result?.error) {
        toast.error("Login failed. Please try again.");
      } else {
        toast.success("Login successful.");
        form.reset();
        router.push("/"); //ToDo: To go to home page
      }
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      router.push(URLS.HOME);
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center">
        <Loader type="dots" />
      </div>
    );
  }

  return (
    <Box maw={500} mx="auto" p="lg" className="shadow-md rounded-md">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          {...form.getInputProps("identifier")}
          label="Email or Phone Number"
          placeholder="Enter email or phone number"
          autoComplete="username"
          required
          mt="md"
        />
        <PasswordInput
          {...form.getInputProps("password")}
          label="Password"
          placeholder="Your password"
          autoComplete="current-password"
          required
          mt="md"
        />
        <Flex justify="space-between" mt="md">
          <Checkbox
            {...form.getInputProps("rememberMe", { type: "checkbox" })}
            label="Remember me"
          />
          <Anchor href="/forgot-password" size="sm">
            Forgot password?
          </Anchor>
        </Flex>
        <Button type="submit" fullWidth mt="md">
          Sign In
        </Button>

        <Flex justify="space-between" mt="md" gap="sm">
          <Button
            onClick={() => signIn("google")}
            type="button"
            variant="outline"
            fullWidth
          >
            Sign In with Google
          </Button>
          <Button
            onClick={() => signIn("facebook")}
            type="button"
            variant="outline"
            fullWidth
          >
            Sign In with Facebook
          </Button>
        </Flex>
      </form>
    </Box>
  );
};

export default Login;
