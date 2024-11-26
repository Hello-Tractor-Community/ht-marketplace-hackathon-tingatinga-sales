"use client";

import { Header } from "@/components/core/header";
import { useGetCurrentUserQuery } from "@/lib/swr/hooks";
import { URLS } from "@/lib/urls/urls";
import { AppShell, NavLink } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconChartAreaLine,
  IconChartArrows,
  IconChartArrowsVertical,
  IconHome,
  IconHome2,
  IconMessageCircle2,
  IconTruck,
  IconUsersGroup,
} from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useParams, usePathname, useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [opened, { toggle }] = useDisclosure();
  const { data: session, status } = useSession();
  const hide =
    path === URLS.SELLER_PROFILE_CREATION ||
    path === URLS.SIGNUP ||
    path === URLS.LOGIN ||
    status !== "authenticated";

  const USER_NAVBAR_ITEMS = [
    {
      label: "Home",
      href: URLS.HOME,
      icon: () => <IconHome size="1rem" stroke={1.5} />,
    },
    {
      label: "My Seller Profile",
      href: session
        ? URLS.SELLERS_PROFILE(session.user.businessName ?? "")
        : "#",
      icon: () => <IconUsersGroup size="1rem" stroke={1.5} />,
    },
    {
      label: "Chats",
      href: URLS.CHAT,
      icon: () => <IconMessageCircle2 size="1rem" stroke={1.5} />,
    },
    {
      label: "Tractor Dealers",
      href: URLS.TRACTOR_DEALERS,
      icon: () => <IconTruck size="1rem" stroke={1.5} />,
    },
  ];

  const SELLER_NAVBAR_ITEMS = [
    {
      label: "Analytics",
      href: URLS.SELLER_ANALYTIC_DASHBOARD,
      icon: () => <IconChartArrowsVertical size="1rem" stroke={1.5} />,
    },
    {
      label: "Sales",
      href: URLS.SELLER_SALES,
      icon: () => <IconChartAreaLine size="1rem" stroke={1.5} />,
    },
  ];

  return (
    <>
      <AppShell
        header={{ height: 70 }}
        padding="md"
        navbar={{
          width: 200,
          breakpoint: "sm",
          collapsed: { mobile: !opened || hide, desktop: hide },
        }}
        transitionDuration={300}
      >
        <AppShell.Header>
          <Header opened={opened} toggle={toggle} />
        </AppShell.Header>
        {session?.user && (
          <AppShell.Navbar p="md">
            {USER_NAVBAR_ITEMS.map((item) => (
              <NavLink
                component="div"
                key={item.label}
                label={item.label}
                leftSection={item.icon()}
                active={path === item.href}
                onClick={() => router.push(item.href)}
                // href={item.href}
              />
            ))}

            {session.user.sellerId && (
              <>
                {SELLER_NAVBAR_ITEMS.map((item) => (
                  <NavLink
                    component="div"
                    key={item.label}
                    label={item.label}
                    leftSection={item.icon()}
                    active={path === item.href}
                    onClick={() => router.push(item.href)}
                    // href={item.href}
                  />
                ))}
              </>
            )}
          </AppShell.Navbar>
        )}
        <AppShell.Main className="py-2">{children}</AppShell.Main>
      </AppShell>
    </>
  );
}
