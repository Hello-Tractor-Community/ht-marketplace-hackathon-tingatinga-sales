import { ChatPreview } from "@/app/(core)/chat/page";
import React, { createContext, ReactNode, useContext, useState } from "react";

// Define the context type
interface ChatContextType {
  selectedChat: ChatPreview | null;
  setSelectedChat: (chat: ChatPreview | null) => void;
}

// Create the context with an undefined default
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Extend the provider to accept initial values and functions
interface ChatProviderProps {
  children: ReactNode;
  selectedChat?: ChatPreview | null;
  setSelectedChat?: (chat: ChatPreview | null) => void;
}

export const ChatProvider = ({
  children,
  selectedChat: initialSelectedChat = null,
  setSelectedChat: initialSetSelectedChat,
}: ChatProviderProps) => {
  const [selectedChat, setSelectedChat] = useState<ChatPreview | null>(
    initialSelectedChat
  );

  // Use the provided function or the default `setSelectedChat`
  const handleSetSelectedChat = initialSetSelectedChat || setSelectedChat;

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat: handleSetSelectedChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook to access the chat context
export const useChatContext = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};
