import { URLS } from "@/lib/urls/urls";
import { Button, Group, Stack, Text } from "@mantine/core";
import { useRouter } from "next/navigation";

const LoginPromptModal = ({}) => {
  const router = useRouter();

  const handleLoginRedirect = () => {
    router.push(URLS.LOGIN);
  };

  const handleSignUpRedirect = () => {
    router.push(URLS.SIGNUP);
  };

  return (
    <Stack gap="md" align="center">
      <Text fw={600} className="text-center">
        You need to log in to proceed. Please log in to access this feature.
      </Text>
      <Group gap="sm">
        <Button onClick={handleLoginRedirect} size="md" variant="filled">
          Login
        </Button>
        <Button onClick={handleSignUpRedirect} size="md" variant="outline">
          Sign Up
        </Button>
      </Group>
    </Stack>
  );
};

export default LoginPromptModal;
