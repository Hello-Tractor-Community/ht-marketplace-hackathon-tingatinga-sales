"use client";

import React, { Suspense, useEffect } from "react";
import { useParams } from "next/navigation";
import { Flex, rem, Tabs } from "@mantine/core";
import {
  IconIdBadge,
  IconKey,
  IconSettings,
  IconSocial,
} from "@tabler/icons-react";
import UserForm from "@/components/core/forms/user-form";
import UserProfile from "@/components/user-profile";
import SecurityForm from "@/components/core/forms/security";
import SettingsPage from "@/components/settings";
import { useRouter } from "next/navigation";
import SocialLinksPage from "@/components/social-links";
import { useSession } from "next-auth/react";
import { URLS } from "@/lib/urls/urls";

const AccountPage = () => {
  const param = useParams<{ tab: string }>().tab;
  const iconStyle = { width: rem(12), height: rem(12) };
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(URLS.LOGIN);
    }
  }, [status]);

  const handleTabChange = (value: string | null) => {
    if (value) {
      router.push(`/account/${value}`); // Change the path based on the selected tab
    }
  };

  console.log("PARAM:", param);

  return (
    <Suspense>
      <>
        <Tabs
          value={param || "profile"}
          onChange={handleTabChange}
          defaultValue={param || "profile"}
        >
          <Tabs.List aria-label="Account">
            <Tabs.Tab
              value="profile"
              leftSection={<IconIdBadge style={iconStyle} />}
            >
              Profile
            </Tabs.Tab>
            <Tabs.Tab
              value="settings"
              leftSection={<IconSettings style={iconStyle} />}
            >
              Settings
            </Tabs.Tab>
            <Tabs.Tab
              value="social"
              leftSection={<IconSocial style={iconStyle} />}
            >
              Social Links
            </Tabs.Tab>
            <Tabs.Tab
              value="security"
              leftSection={<IconKey style={iconStyle} />}
            >
              Security
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="profile" pt={10}>
            <Profile />
          </Tabs.Panel>

          <Tabs.Panel value="settings" pt={10}>
            <Settings />
          </Tabs.Panel>

          <Tabs.Panel value="social" pt={10}>
            <SocialLinks />
          </Tabs.Panel>

          <Tabs.Panel value="security" pt={10}>
            <Security />
          </Tabs.Panel>
        </Tabs>
      </>
    </Suspense>
  );
};

const Profile = () => {
  return (
    <Flex gap={{ base: 0, md: 10 }} direction={{ base: "column", md: "row" }}>
      <UserProfile />
      <UserForm />
    </Flex>
  );
};

const Settings = () => {
  return (
    <>
      <SettingsPage />
    </>
  );
};

const SocialLinks = () => {
  return (
    <>
      <SocialLinksPage />
    </>
  );
};

const Security = () => {
  return (
    <>
      <SecurityForm />
    </>
  );
};

export default AccountPage;
