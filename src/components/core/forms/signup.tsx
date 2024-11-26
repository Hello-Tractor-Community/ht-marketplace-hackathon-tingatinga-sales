"use client";
import { useSignUpMutation } from "@/lib/swr/hooks";
import { URLS } from "@/lib/urls/urls";
import { Box, Button, Flex, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { toast } from "sonner";

const Signup = () => {
  const { user, error, trigger, isMutating } = useSignUpMutation();

  const form = useForm({
    initialValues: {
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      rememberMe: false,
    },
    validate: {
      email: (value) =>
        /^\S+@\S+\.\S+$/.test(value) ? null : "Enter a valid email",
      phoneNumber: (value) =>
        /^\d{10,15}$/.test(value)
          ? null
          : "Enter a valid email or phone number",
      password: (value) =>
        value.length < 6 ? "Password must be at least 6 characters long" : null,
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords did not match" : null,
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    trigger(values)
      .then(() => {
        toast.success("Sign up successful. You can now log in.");
        form.reset();
        window.location.href = URLS.LOGIN;
      })
      .catch((error) => {
        console.error(error);
        toast.error(`Sign up failed. Please try again. ${error.message}`);
      });
  };

  return (
    <div className="flex items-center justify-center">
      <Box maw={500} mx="auto" p="lg" className="shadow w-[400px]">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            {...form.getInputProps("email")}
            mt="md"
            label="Email"
            placeholder="Enter email or phone number"
            required
          />
          <TextInput
            {...form.getInputProps("phoneNumber")}
            mt="md"
            label="Phone Number"
            placeholder="Enter phone number"
            required
          />
          <TextInput
            {...form.getInputProps("firstName")}
            mt="md"
            label="First Name"
            placeholder="Enter first name"
            required
          />
          <TextInput
            {...form.getInputProps("lastName")}
            mt="md"
            label="Last Name"
            placeholder="Enter last name"
            required
          />
          <PasswordInput
            {...form.getInputProps("password")}
            label="Password"
            placeholder="Your password"
            mt="md"
            required
          />
          <PasswordInput
            mt="sm"
            label="Confirm Password"
            placeholder="Confirm your password"
            required
            {...form.getInputProps("confirmPassword")}
          />

          <Button
            type="submit"
            fullWidth
            mt="md"
            my={18}
            loading={isMutating}
            disabled={isMutating}
          >
            Sign Up
          </Button>

          <Flex justify={"space-between"} mt="md">
            <Button type="submit" variant="outline">
              Sign In with Google
            </Button>
            <Button type="submit" variant="outline">
              Sign In with Facebook
            </Button>
          </Flex>
        </form>
      </Box>
    </div>
  );
};

export default Signup;
