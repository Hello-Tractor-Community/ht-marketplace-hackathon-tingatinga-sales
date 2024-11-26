import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: Request) {
  try {
    const { messageIds, senderId, receiverId } = await req.json();

    // Update messages in the database
    await prisma.message.updateMany({
      where: {
        id: {
          in: messageIds,
        },
        receiverId: receiverId,
        senderId: senderId,
      },
      data: {
        seen: true,
      },
    });

    
    // Trigger Pusher event to notify the sender
    await pusherServer.trigger(
      `chat_${senderId}_${receiverId}`,
      "messages-seen",
      {
        messageIds,
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking messages as seen:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
