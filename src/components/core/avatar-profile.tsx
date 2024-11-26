import { URLS } from "@/lib/urls/urls";
import {
  Avatar,
  Badge,
  Button,
  Divider,
  Drawer,
  Group,
  NavLink,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconMessageCircle,
  IconSettings,
  IconShieldLock,
  IconUser,
} from "@tabler/icons-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const profileNavlinks = [
  {
    label: "Profile",
    href: "/account/profile",
    icon: () => <IconUser size="1rem" stroke={1.5} />,
  },
  {
    label: "Security",
    href: "/account/security",
    icon: () => <IconShieldLock size="1rem" stroke={1.5} />,
  },
  {
    label: "Account",
    href: "/account/settings",
    icon: () => <IconSettings size="1rem" stroke={1.5} />,
  },
  {
    label: "Support",
    href: "/account/support",
    icon: () => <IconMessageCircle size="1rem" stroke={1.5} />,
  },
];

const AvatarProfile = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const router = useRouter();
  const { data } = useSession();

  const handleSignOut = async () => {
    signOut().then(() => {
      router.push(URLS.HOME);
    });
  };

  return (
    <>
      <Drawer
        opened={opened}
        onClose={close}
        position="right"
        size="xs"
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      >
        <Stack align="center" my={30}>
          <div className="relative flex items-center justify-center w-24 h-24">
            <div className="absolute inset-0 w-full h-full rounded-full animate-spin-slow border-2 border-primary border-t-transparent"></div>
            <Avatar
              onClick={open}
              src={"https://randomuser.me/api/portraits/men/9.jpg"}
              alt={`firstName lastName`}
              name={`firstName lastName`}
              color="initials"
              size={"xl"}
            />
          </div>
          <div className="text-center">
            <Group>
              <Text size="xl" fw={600}>
                {data?.user.name}
              </Text>
              {data?.user.sellerId && <Badge color="green">Seller</Badge>}
            </Group>
            <Text>{data?.user.email}</Text>
          </div>
        </Stack>
        <Divider />
        <Stack gap={"xs"} my={30}>
          {profileNavlinks.map((item) => (
            <NavLink
              component="div"
              key={item.label}
              label={item.label}
              leftSection={item.icon()}
              onClick={() => {
                router.push(item.href);
                close();
              }}
              // href={item.href}
            />
          ))}
        </Stack>
        <Button className="w-full" color="red.7" onClick={handleSignOut}>
          Logout
        </Button>
      </Drawer>
      <Avatar
        onClick={open}
        src={"https://randomuser.me/api/portraits/men/9.jpg"}
        alt={`firstName lastName`}
        name={`firstName lastName`}
        color="initials"
      />
    </>
  );
};

export default AvatarProfile;
