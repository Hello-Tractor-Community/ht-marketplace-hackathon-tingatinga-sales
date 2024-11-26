"use client";
import { useChatContext } from "@/lib/context/chat";
import { pusherClient } from "@/lib/pusher";
import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Card,
  Drawer,
  Flex,
  Group,
  LoadingOverlay,
  ScrollArea,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { IconCheck, IconChecks, IconSend, IconX } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface Message {
  id: number | string;
  content: string;
  senderId: string;
  receiverId: string;
  timestamp: Date;
  seen: boolean;
  pending?: boolean;
}

interface ChatUIProps {
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

const MessagingUI: React.FC<ChatUIProps> = ({
  receiverId,
  receiverName,
  receiverImage,
}) => {
  const { data: session } = useSession();
  const { setSelectedChat } = useChatContext();
  const [messageMap, setMessageMap] = useState<Map<number | string, Message>>(
    new Map()
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentUserId = session?.user?.id;

  const messages = Array.from(messageMap.values()).sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  );

  const updateMessages = useCallback((newMessage: Message) => {
    setMessageMap((prevMap) => {
      const newMap = new Map(prevMap);
      if (!newMap.has(newMessage.id) || newMessage.pending === false) {
        newMap.set(newMessage.id, newMessage);
      }
      return newMap;
    });
  }, []);

  const markMessagesAsSeen = useCallback(async () => {
    if (!currentUserId || !isVisible) return;

    const unseenMessages = messages.filter(
      (msg) => !msg.seen && msg.senderId === receiverId
    );

    if (unseenMessages.length === 0) return;

    const messageIds = unseenMessages.map((msg) => msg.id);

    try {
      await fetch("/api/messages/seen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageIds,
          senderId: receiverId,
          receiverId: currentUserId,
        }),
      });
    } catch (error) {
      console.error("Error marking messages as seen:", error);
    }
  }, [currentUserId, receiverId, messages, isVisible]);

  const scrollToBottom = useCallback(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Fetch Messages
  const fetchMessages = useCallback(async () => {
    if (!currentUserId) return;

    try {
      const response = await fetch(
        `/api/messages?senderId=${currentUserId}&receiverId=${receiverId}`
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch messages");
      }

      const data = await response.json();
      const newMessageMap = new Map();

      data.forEach((msg: any) => {
        newMessageMap.set(msg.id, {
          id: msg.id,
          content: msg.content,
          senderId: msg.senderId,
          receiverId: msg.receiverId,
          timestamp: new Date(msg.createdAt),
          seen: msg.seen,
          pending: false,
        });
      });

      setMessageMap(newMessageMap);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [currentUserId, receiverId]);

  // Subscribe to Pusher
  const subscribeToPusher = useCallback(() => {
    if (!currentUserId) return;

    const channel = pusherClient.subscribe(
      `chat_${currentUserId}_${receiverId}`
    );

    channel.bind("new-message", (message: any) => {
      const formattedMessage = {
        ...message,
        sender: message.senderId === currentUserId ? "me" : "other",
        timestamp: new Date(message.createdAt),
        pending: false,
      };

      setMessageMap((prevMap) => {
        const newMap = new Map(prevMap);
        Array.from(newMap.entries()).forEach(([key, msg]) => {
          if (msg.pending && msg.content === message.content) {
            newMap.delete(key);
          }
        });
        newMap.set(message.id, formattedMessage);
        return newMap;
      });

      if (isVisible && message.senderId === receiverId) {
        markMessagesAsSeen();
      }
    });

    channel.bind(
      "messages-seen",
      ({ messageIds }: { messageIds: number[] }) => {
        setMessageMap((prevMap) => {
          const newMap = new Map(prevMap);
          messageIds.forEach((id) => {
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
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [currentUserId, receiverId, isVisible]);

 
  // Fetch Messages and Subscribe to Pusher
  useEffect(() => {
    if (!session?.user?.id) return;

    fetchMessages();
    const unsubscribe = subscribeToPusher();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [session?.user?.id, fetchMessages, subscribeToPusher]);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, scrollToBottom]);
  // Mark Messages as Seen Effect
  useEffect(() => {
    if (isVisible) {
      markMessagesAsSeen();
    }
  }, [isVisible, markMessagesAsSeen]);

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

    // Optimistically add the message
    setMessageMap((prevMap) => {
      const newMap = new Map(prevMap);
      newMap.set(tempId, tempMessage);
      return newMap;
    });
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

      const sentMessage = await response.json();

      // Replace temporary message with server-confirmed message
      setMessageMap((prevMap) => {
        const newMap = new Map(prevMap);
        newMap.delete(tempId);
        newMap.set(sentMessage.id, {
          ...sentMessage,
          timestamp: new Date(sentMessage.createdAt),
          pending: false,
        });
        return newMap;
      });
    } catch (error) {
      console.error("Error sending message:", error);
      // Remove temporary message on error
      setMessageMap((prevMap) => {
        const newMap = new Map(prevMap);
        newMap.delete(tempId);
        return newMap;
      });
    } finally {
      setLoading(false);
      // Refocus input after sending
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  return (
    <Card className="flex-grow h-full">
      <Flex justify="space-between" style={{ width: "100%" }}>
        <Group gap="sm">
          <Avatar color="initials" name={receiverName} src={receiverImage} />
          <Text fw={500}>{receiverName}</Text>
        </Group>
        <ActionIcon
          onClick={() => {
            setSelectedChat(null);
            close();
          }}
          aria-label="Close chat"
          size="md"
          variant="default"
        >
          <IconX style={{ width: "70%", height: "70%" }} stroke={1.5} />
        </ActionIcon>
      </Flex>

      <Stack h="calc(100vh - 180px)" gap="md" className="mt-4">
        <ScrollArea
 viewportRef={scrollAreaRef} //          ref={scrollAreaRef}
          className="overflow-y-auto flex-grow px-4 pt-2 pb-4"
          style={{
            maxHeight: "calc(100vh - 250px)",
            overflowY: "auto",
          }}
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
              }}
            >
              <div
                className={`max-w-[70%] flex flex-col items-${
                  message.senderId === currentUserId ? "flex-end" : "flex-start"
                }`}
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
                  // className={`p-3 rounded-xl ${
                  //   message.senderId === currentUserId
                  //     ? "bg-orange-500 text-white"
                  //     : "bg-gray-200 text-black"
                  // } ${message.pending ? "opacity-70" : "opacity-100"}`}
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
                  <Text c={message.senderId === currentUserId ? "white" : "black"} size="sm">{message.content}</Text>
                  </Card></div>
                <Group gap={4} mt={4} className="flex items-center">
                  <Text size="xs" c="dimmed">
                    {formatTime(message.timestamp)}
                  </Text>
                  {message.senderId === currentUserId &&
                    (message.seen ? (
                      <IconChecks size={16} className="text-blue-500" />
                    ) : (
                      <IconChecks
                        size={16}
                        style={{
                          color: "gray",
                          opacity: message.pending ? 0.5 : 1,
                          transition: "opacity 0.2s ease-in-out",
                        }}
                      />
                    ))}
                </Group>
              </div>
            </Group>
          ))}
          <div ref={messageEndRef} />
        </ScrollArea>

        <Group className="w-full gap-2">
          <TextInput
            ref={inputRef}
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.currentTarget.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            className="flex-grow"
          />
          <Button
            onClick={handleSend}
            variant="filled"
            disabled={!input.trim() || loading}
            className="px-4"
          >
            <IconSend size={20} />
          </Button>
        </Group>
      </Stack>
    </Card>
  );
};

export default MessagingUI;
