"use client";
import { pusherClient } from "@/lib/pusher";
import {
  ActionIcon,
  Avatar,
  Button,
  Card,
  Drawer,
  Flex,
  Group,
  ScrollArea,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { IconCheck, IconChecks, IconSend, IconX } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import LoginPromptModal from "../modals/login-prompt";

interface Message {
  id: number | string; // Updated to support both number and string IDs
  content: string;
  senderId: string;
  receiverId: string;
  timestamp: Date;
  seen: boolean;
  pending?: boolean;
}

interface ChatUIProps {
  opened: boolean;
  close: () => void;
  receiverId: string;
  receiverName: string;
  receiverImage?: string;
}

const formatTime = (date: Date) => {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ChatUI: React.FC<ChatUIProps> = ({
  opened,
  close,
  receiverId,
  receiverName,
  receiverImage,
}) => {
  const { data: session, status } = useSession();
  const [messageMap, setMessageMap] = useState<Map<number | string, Message>>(
    new Map()
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const currentUserId = session?.user?.id;
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);

  const messages = Array.from(messageMap.values()).sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const updateMessages = useCallback((newMessage: Message) => {
    setMessageMap((prevMap) => {
      const newMap = new Map(prevMap);
      // Only update if the message doesn't exist or if it's no longer pending
      if (!newMap.has(newMessage.id) || newMessage.pending === false) {
        newMap.set(newMessage.id, {
          ...newMessage,
          timestamp: new Date(newMessage.timestamp),
        });
      }
      return newMap;
    });
  }, []);

  const markMessagesAsSeen = useCallback(async () => {
    if (!currentUserId || !isVisible || !opened) return;

    const unseenMessages = messages.filter(
      (msg) => !msg.seen && msg.senderId === receiverId
    );

    if (unseenMessages.length === 0) return;

    try {
      const response = await fetch("/api/messages/seen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageIds: unseenMessages.map((msg) => msg.id),
          senderId: receiverId,
          receiverId: currentUserId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to mark messages as seen");
      }

      setMessageMap((prevMap) => {
        const newMap = new Map(prevMap);
        unseenMessages.forEach((msg) => {
          newMap.set(msg.id, { ...msg, seen: true });
        });
        return newMap;
      });
    } catch (error) {
      console.error("Error marking messages as seen:", error);
    }
  }, [currentUserId, isVisible, messages, receiverId, opened]);

  // Handle scroll events
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const { scrollHeight, scrollTop, clientHeight } = event.currentTarget;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 50;
    setIsAutoScrollEnabled(isNearBottom);
  }, []);

  // Visibility change handler
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Mark messages as seen when chat is visible
  useEffect(() => {
    if (opened && isVisible) {
      const timeoutId = setTimeout(markMessagesAsSeen, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [opened, isVisible, markMessagesAsSeen, messages]);

  const scrollToBottom = useCallback(() => {
    if (messageEndRef.current && isAutoScrollEnabled) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isAutoScrollEnabled]);

  const fetchMessages = useCallback(async () => {
    if (!currentUserId || !receiverId) return;

    try {
      const response = await fetch(
        `/api/messages?senderId=${currentUserId}&receiverId=${receiverId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const data = await response.json();
      const newMessageMap = new Map();

      data.forEach((msg: any) => {
        newMessageMap.set(msg.id, {
          ...msg,
          timestamp: new Date(msg.createdAt),
          pending: false,
        });
      });

      setMessageMap(newMessageMap);
      setIsAutoScrollEnabled(true);
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [currentUserId, receiverId, scrollToBottom]);

  const subscribeToPusher = useCallback(() => {
    if (!currentUserId || !receiverId) return;

    const channelName = `chat_${currentUserId}_${receiverId}`;
    const channel = pusherClient.subscribe(channelName);

    channel.bind("new-message", (message: any) => {
      const formattedMessage = {
        ...message,
        timestamp: new Date(message.createdAt),
        pending: false,
      };

      updateMessages(formattedMessage);

      if (isVisible && message.senderId === receiverId) {
        markMessagesAsSeen();
      }

      if (isAutoScrollEnabled) {
        setTimeout(scrollToBottom, 100);
      }
    });

    channel.bind(
      "messages-seen",
      (data: { messageIds: (number | string)[] }) => {
        setMessageMap((prevMap) => {
          const newMap = new Map(prevMap);
          data.messageIds.forEach((id) => {
            const message = newMap.get(id);
            if (message) {
              newMap.set(id, { ...message, seen: true });
            }
          });
          return newMap;
        });
      }
    );

    return () => {
      pusherClient.unsubscribe(channelName);
    };
  }, [
    currentUserId,
    receiverId,
    isVisible,
    markMessagesAsSeen,
    updateMessages,
    scrollToBottom,
    isAutoScrollEnabled,
  ]);

  useEffect(() => {
    if (!currentUserId || !opened) return;

    fetchMessages();
    const unsubscribe = subscribeToPusher();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [opened, currentUserId, fetchMessages, subscribeToPusher]);

  useEffect(() => {
    if (messages.length > 0 && isAutoScrollEnabled) {
      scrollToBottom();
    }
  }, [messages.length, scrollToBottom, isAutoScrollEnabled]);

  const handleSend = async () => {
    if (!input.trim() || loading || !currentUserId) return;

    const messageContent = input.trim();
    setInput("");

    const tempId = `temp-${Date.now()}`;
    const tempMessage: Message = {
      id: tempId,
      content: messageContent,
      senderId: currentUserId,
      receiverId,
      timestamp: new Date(),
      seen: false,
      pending: true,
    };

    updateMessages(tempMessage);
    setIsAutoScrollEnabled(true);
    scrollToBottom();

    try {
      setLoading(true);
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: messageContent,
          senderId: currentUserId,
          receiverId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      // Remove temp message on successful send
      setMessageMap((prevMap) => {
        const newMap = new Map(prevMap);
        newMap.delete(tempId);
        return newMap;
      });
    } catch (error) {
      console.error("Error sending message:", error);
      // Remove temp message on error
      setMessageMap((prevMap) => {
        const newMap = new Map(prevMap);
        newMap.delete(tempId);
        return newMap;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      opened={opened}
      onClose={close}
      position="right"
      size="md"
      padding="md"
      withCloseButton={false}
    >
      {status === "authenticated" ? (
        <>
          <Flex justify="space-between" style={{ width: "100%" }}>
            <Group gap="sm">
              <Avatar color="indigo" radius="xl" src={receiverImage}>
                {receiverName.charAt(0)}
              </Avatar>
              <Text fw={500}>{receiverName}</Text>
            </Group>
            <ActionIcon
              onClick={close}
              aria-label="Close chat"
              size="md"
              variant="default"
            >
              <IconX style={{ width: "70%", height: "70%" }} stroke={1.5} />
            </ActionIcon>
          </Flex>

          <Stack h="calc(100vh - 80px)" gap="md">
            <ScrollArea
              h="calc(100% - 60px)"
              viewportRef={scrollAreaRef}
              onScrollCapture={handleScroll}
              style={{ padding: "16px" }}
            >
              {messages.map((message) => (
                <Group
                  key={message.id}
                  style={{
                    maxWidth: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems:
                      message.senderId === currentUserId
                        ? "flex-end"
                        : "flex-start",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "70%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems:
                        message.senderId === currentUserId
                          ? "flex-end"
                          : "flex-start",
                    }}
                  >
                    <Card
                      shadow="sm"
                      p="sm"
                      style={{
                        backgroundColor:
                          message.senderId === currentUserId
                            ? "#f06418"
                            : "#f0f0f0",
                        borderRadius: "12px",
                        borderBottomRightRadius:
                          message.senderId === currentUserId ? "4px" : "12px",
                        borderBottomLeftRadius:
                          message.senderId !== currentUserId ? "4px" : "12px",
                        opacity: message.pending ? 0.7 : 1,
                        transition: "opacity 0.2s ease-in-out",
                      }}
                    >
                      <Text
                        c={
                          message.senderId === currentUserId ? "white" : "black"
                        }
                        size="sm"
                        style={{ wordBreak: "break-word" }}
                      >
                        {message.content}
                      </Text>
                    </Card>
                    <Group gap={4} mt={4}>
                      <Text size="xs" c="dimmed">
                        {formatTime(message.timestamp)}
                      </Text>
                      {message.senderId === currentUserId &&
                        (message.seen ? (
                          <IconChecks size={16} style={{ color: "#0084ff" }} />
                        ) : (
                          <IconCheck
                            size={16}
                            style={{
                              color: "gray",
                              opacity: message.pending ? 0.5 : 1,
                            }}
                          />
                        ))}
                    </Group>
                  </div>
                </Group>
              ))}
              <div ref={messageEndRef} />
            </ScrollArea>

            <Group style={{ width: "100%" }} gap="xs">
              <TextInput
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.currentTarget.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                style={{ flex: 1 }}
                disabled={loading}
              />
              <Button
                onClick={handleSend}
                variant="filled"
                disabled={!input.trim() || loading}
              >
                <IconSend size={20} />
              </Button>
            </Group>
          </Stack>
        </>
      ) : (
        <Flex
          h="calc(100vh - 80px)"
          gap="md"
          className="flex justify-center items-center"
        >
          <LoginPromptModal />
        </Flex>
      )}
    </Drawer>
  );
};

export default ChatUI;
