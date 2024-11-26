"use client";
import { URLS } from "@/lib/urls/urls";
import { Burger, Button, Flex, Group, Skeleton } from "@mantine/core";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AvatarProfile from "./avatar-profile";
import { ColorSchemeToggle } from "./color-scheme-toggle";
import UnreadNotifications from "./notifications/unread-notifications";
import Image from "next/image";

export function Header({
  opened,
  toggle,
}: {
  opened?: boolean;
  toggle?: () => void;
}) {
  const { status, data } = useSession();
  const router = useRouter();

  return (
    <header className={`${opened === undefined && "border-b"}  mb-2`}>
      <Group h="100%" px="md" justify="space-between" align="center">
        <Group gap="sm">
          {opened !== undefined && (
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
              aria-label="menu"
            />
          )}
          <Link href={URLS.HOME}>
            <Image
              src="/ht-logo.png"
              alt="TingaTinga Logo"
              width={150}
              height={100}
            />
          </Link>
        </Group>
        <Group gap="sm">
          <Flex gap="md" align="center">
            {status === "loading" && (
              <>
                <Skeleton height={18} width={65} />
                <Skeleton height={18} width={65} />
              </>
            )}
            {status === "unauthenticated" && (
              <>
                <Link href={URLS.SIGNUP}>Sign Up</Link>
                <Link href={URLS.LOGIN}>Login</Link>
              </>
            )}
          </Flex>
          <ColorSchemeToggle />
          {status === "authenticated" && (
            <>
              <UnreadNotifications />
              <AvatarProfile />
            </>
          )}
          {!data?.user.sellerId && (
            <Button onClick={() => router.push(URLS.SELLER_PROFILE_CREATION)}>
              Become a Seller
            </Button>
          )}
        </Group>
      </Group>
    </header>
  );
}
