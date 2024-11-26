"use client";

import MessagingUI from "@/components/core/messaging";
import {
  Card,
  Flex,
  Stack,
  Text,
  ScrollArea,
  Group,
  Avatar,
} from "@mantine/core";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/lib/pusher";
import { ChatProvider } from "@/lib/context/chat";
import { useRouter } from "next/navigation";
import { URLS } from "@/lib/urls/urls";

export interface ChatPreview {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: Date;
  image?: string;
  unreadCount: number;
}

const Page = () => {
  const { data: session, status } = useSession();
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatPreview | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(URLS.LOGIN);
    }
  }, [status]);

  const updateChatPreview = useCallback(
    (message: {
      senderId: string;
      receiverId: string;
      content: string;
      createdAt: string;
    }) => {
      setChats((prevChats) => {
        const currentUserId = session?.user?.id;
        const otherUserId =
          message.senderId === currentUserId
            ? message.receiverId
            : message.senderId;

        // Remove any existing chat with this ID first
        const filteredChats = prevChats.filter(
          (chat) => chat.id !== otherUserId
        );

        // Find the existing chat to get its details
        const existingChat = prevChats.find((chat) => chat.id === otherUserId);

        if (!existingChat) {
          return prevChats; // Return unchanged if no existing chat found
        }

        // Create the updated chat
        const updatedChat = {
          ...existingChat,
          lastMessage: message.content,
          timestamp: new Date(message.createdAt),
          unreadCount:
            message.senderId === currentUserId ||
            selectedChat?.id === otherUserId
              ? existingChat.unreadCount
              : existingChat.unreadCount + 1,
        };

        // Return new array with updated chat at the beginning
        return [updatedChat, ...filteredChats];
      });
    },
    [session?.user?.id, selectedChat]
  );

  const subscribeToPusher = useCallback(() => {
    if (!session?.user?.id) return;

    const channel = pusherClient.subscribe(`user_${session.user.id}_chats`);

    channel.bind("new-message", (message: any) => {
      updateChatPreview(message);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [session?.user?.id, updateChatPreview]);

  useEffect(() => {
    const fetchChats = async () => {
      if (!session?.user?.id) return;

      try {
        const response = await fetch(`/api/chats`);
        if (!response.ok) throw new Error("Failed to fetch chats");
        const data = await response.json();

        // Sort chats by timestamp before setting state
        const sortedChats = data.sort(
          (a: ChatPreview, b: ChatPreview) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        setChats(sortedChats);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats();
    const unsubscribe = subscribeToPusher();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [session?.user?.id, subscribeToPusher]);

  const markChatAsRead = useCallback(async (chatId: string) => {
    try {
      await fetch(`/api/chats/${chatId}/read`, {
        method: "POST",
      });

      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
        )
      );
    } catch (error) {
      console.error("Error marking chat as read:", error);
    }
  }, []);

  const handleChatSelect = useCallback(
    (chat: ChatPreview) => {
      setSelectedChat(chat);
      if (chat.unreadCount > 0) {
        markChatAsRead(chat.id);
      }
    },
    [markChatAsRead]
  );

  return (
    <ChatProvider selectedChat={selectedChat} setSelectedChat={setSelectedChat}>
      <Flex gap="xs" style={{ height: "calc(100vh - 110px)" }}>
        <Card
          shadow="xs"
          padding="md"
          radius="md"
          withBorder
          style={{ width: 300 }}
        >
          <Stack>
            <Text fw={700} size="xl">
              Chats
            </Text>
            <ScrollArea h="calc(100vh - 140px)">
              <Stack gap="sm">
                {chats.map((chat) => (
                  <Card
                    key={chat.id}
                    padding="sm"
                    radius="md"
                    onClick={() => handleChatSelect(chat)}
                    style={{
                      cursor: "pointer",
                      backgroundColor:
                        selectedChat?.id === chat.id
                          ? "#f0f0f0"
                          : "transparent",
                    }}
                  >
                    <Group>
                      <Avatar color="blue" radius="xl" src={chat.image}>
                        {chat.name.charAt(0)}
                      </Avatar>
                      <Stack gap={4} style={{ flex: 1 }}>
                        <Group justify="space-between">
                          <Text fw={500} size="sm">
                            {chat.name}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {new Date(chat.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Text>
                        </Group>
                        <Text size="sm" lineClamp={1} c="dimmed">
                          {chat.lastMessage}
                        </Text>
                      </Stack>
                      {chat.unreadCount > 0 && (
                        <div
                          style={{
                            backgroundColor: "#f06418",
                            color: "white",
                            borderRadius: "50%",
                            width: 20,
                            height: 20,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 12,
                          }}
                        >
                          {chat.unreadCount}
                        </div>
                      )}
                    </Group>
                  </Card>
                ))}
              </Stack>
            </ScrollArea>
          </Stack>
        </Card>

        <Card
          shadow="xs"
          padding="md"
          radius="md"
          withBorder
          style={{ flex: 1 }}
        >
          {selectedChat ? (
            <MessagingUI
              receiverId={selectedChat.id}
              receiverName={selectedChat.name}
              receiverImage={selectedChat.image}
            />
          ) : (
            <Flex align="center" justify="center" style={{ height: "100%" }}>
              <Text c="dimmed">Select a chat to start messaging</Text>
            </Flex>
          )}
        </Card>
      </Flex>
    </ChatProvider>
  );
};

export default Page;
