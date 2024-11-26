import { Text } from "@mantine/core";

export function Footer() {
  return (
    <footer className="w-full flex justify-center">
      <Text>&copy; {new Date().getFullYear()} TingaTinga</Text>
    </footer>
  );
}
