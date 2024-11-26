"use client";
import { Flex, Modal, Stack, Text } from "@mantine/core";
import { IconMail, IconPhone } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import LoginPromptModal from "./login-prompt";

interface ContactSellerModalProps {
  open: boolean;
  onClose: () => void;
  phoneNumber: string;
  email: string;
}

const ContactSellerModal: React.FC<ContactSellerModalProps> = ({
  open,
  onClose,
  phoneNumber,
  email,
}) => {
  const { status } = useSession();

  return (
    <Modal opened={open} onClose={onClose} title="Contact Seller" centered>
      {status === "authenticated" ? (
        <>
          <Stack>
            <Flex direction="row" align="center" gap="xs">
              <IconPhone />
              <Text fw={600}>Phone Number: {phoneNumber}</Text>
            </Flex>
            <Flex direction="row" align="center" gap="xs">
              <IconMail />
              <Text fw={600}>Email: {email}</Text>
            </Flex>
          </Stack>
        </>
      ) : (
        <LoginPromptModal />
      )}
    </Modal>
  );
};

export default ContactSellerModal;
