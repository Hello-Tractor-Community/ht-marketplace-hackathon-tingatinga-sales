import { useGetSellerProfileQuery } from "@/lib/swr/hooks";
import { Anchor, Box, Button, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconMessageCircle } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import LoginPromptModal from "../modals/login-prompt";
import ChatUI from "../product/messaging-ui";

const SellerContact = () => {
  const { status } = useSession();
  const { businessName } = useParams<{ businessName: string }>();
  const { sellerProfile } = useGetSellerProfileQuery(businessName);

  if (status === "unauthenticated") {
    return (
      <Box>
        <LoginPromptModal />
      </Box>
    );
  }
  const [openedChatDrawer, { open: openChatDrawer, close: closeChatDrawer }] =
    useDisclosure(false);

  return (
    <Box mt={12}>
      <ChatUI
        opened={openedChatDrawer}
        close={closeChatDrawer}
        receiverId={sellerProfile?.userId ?? ""}
        receiverName={sellerProfile?.businessName ?? ""}
        receiverImage={"https://i.pravatar.cc/800"}
      />

      <Text size="lg" fw={500}>
        Contact Information
      </Text>
      <Button
        autoContrast
        variant="subtle"
        leftSection={<IconMessageCircle />}
        onClick={openChatDrawer}
      >
        Send Message
      </Button>
      <Stack gap="xs">
        <Text>
          <strong>Phone:</strong> {sellerProfile?.phoneNumber}
        </Text>
        <Text>
          <strong>Email:</strong>{" "}
          <Anchor href={`mailto:${sellerProfile?.email}`} color="blue">
            {sellerProfile?.email}
          </Anchor>
        </Text>
        {sellerProfile?.preferredContactMethod && (
          <Text>
            <strong>Preferred Contact:</strong>{" "}
            {sellerProfile?.preferredContactMethod}
          </Text>
        )}
        {sellerProfile?.website && (
          <Text>
            <strong>Website:</strong>{" "}
            <Anchor href={sellerProfile?.website} color="blue" target="_blank">
              {sellerProfile?.website}
            </Anchor>
          </Text>
        )}
      </Stack>
      {/* {sellerProfile?.socialLinks?.length > 0 && (
        <Group mt="md">
          {sellerProfile?.socialLinks.map(
            (link: { url: string; platform: string }, index: number) => (
              <Anchor
                key={index}
                href={link.url}
                target="_blank"
                c="gray.7"
                title={`Visit ${link.platform}`}
              >
                {link.platform === "Facebook" ? (
                  <IconBrandFacebook />
                ) : link.platform === "Instagram" ? (
                  <IconBrandInstagram />
                ) : null}
              </Anchor>
            )
          )}
        </Group>
      )} */}
    </Box>
  );
};

export default SellerContact;
