import { auth } from "@/lib/next-auth/auth";
import { prisma } from "@/lib/prisma/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth();
  try {
    if (!session?.user.id) {
      return new NextResponse("Unauthorised", { status: 401 });
    }

    const userId = session.user.id;

    // Fetch latest message per chat (grouped by sender-receiver pairs)
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: {
        createdAt: "desc",
      },
      distinct: ["senderId", "receiverId"], // Get distinct chats
    });

    const chatMap = new Map();

    messages.forEach((message) => {
      const chatKey = [message.senderId, message.receiverId].sort().join("-");
      if (!chatMap.has(chatKey)) {
        chatMap.set(chatKey, message);
      }
    });

    const chats = Array.from(chatMap.values());

    // Map chats to ChatPreview format
    const chatPreviews = await Promise.all(
      chats.map(async (message) => {
        // Determine the other user in the chat
        const otherUserId =
          message.senderId === userId ? message.receiverId : message.senderId;

        // Fetch user details
        const otherUser = await prisma.user.findUnique({
          where: { id: otherUserId },
        });

        // Count unread messages
        const unreadCount = await prisma.message.count({
          where: {
            senderId: otherUserId,
            receiverId: userId,
            seen: false,
          },
        });

        return {
          id: otherUserId,
          name: `${otherUser?.firstName} ${otherUser?.lastName}` || "Unknown",
          lastMessage: message.content,
          timestamp: message.createdAt,
          image: otherUser?.image || null,
          unreadCount,
        };
      })
    );

    // pusherServer.trigger(`user_${userId}_chats`, "new-message", {
    //     message: chatPreviews,
    // });

    return NextResponse.json(chatPreviews, { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
