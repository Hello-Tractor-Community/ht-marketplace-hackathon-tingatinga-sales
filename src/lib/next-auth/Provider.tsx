"use client";
import { useMantineColorScheme } from "@mantine/core";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ReactNode } from "react";
import { Toaster } from "sonner";

interface SessionProviderProps {
  children: ReactNode;
}

const Wrapper = ({ children }: SessionProviderProps) => {
  const { colorScheme } = useMantineColorScheme();

  return (
    <NextAuthSessionProvider>
      <Toaster theme={colorScheme === "auto" ? "system" : colorScheme} />
      <NuqsAdapter>{children}</NuqsAdapter>
    </NextAuthSessionProvider>
  );
};

export default Wrapper;
