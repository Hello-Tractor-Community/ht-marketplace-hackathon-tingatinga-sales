import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma";
import { pusherServer } from "@/lib/pusher";
import { z } from "zod";

const MessageSchema = z.object({
  content: z.string().min(1, "Message content is required"),
  senderId: z.string().min(1, "Sender ID is required"),
  receiverId: z.string().min(1, "Sender ID is required"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, senderId, receiverId } = MessageSchema.parse(body);

    if (!content || !senderId || !receiverId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const message = await prisma.message.create({
      data: {
        content,
        senderId,
        receiverId,
      },
    });

    // Trigger Pusher events for real-time updates
    const channelSender = `chat_${senderId}_${receiverId}`;
    const channelReceiver = `chat_${receiverId}_${senderId}`;

    await Promise.all([
      // Trigger for direct chat channels
      pusherServer.trigger(channelSender, "new-message", message),
      pusherServer.trigger(channelReceiver, "new-message", message),

      // Trigger for users' personal channels (for chat list updates)
      pusherServer.trigger(`user_${senderId}_chats`, "new-message", message),
      pusherServer.trigger(`user_${receiverId}_chats`, "new-message", message),
    ]);

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle Zod validation errors
      return NextResponse.json(
        { error: error.errors.map((e) => e.message).join(", ") },
        { status: 400 }
      );
    }
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const senderId = searchParams.get("senderId");
    const receiverId = searchParams.get("receiverId");

    if (!senderId || !receiverId) {
      return new NextResponse("Missing required parameters", { status: 400 });
    }
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
      include: {
        sender: true,
        receiver: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Mark retrieved messages as read if they were sent to the requester
    await prisma.message.updateMany({
      where: {
        senderId: receiverId,
        receiverId: senderId,
        seen: false,
      },
      data: {
        seen: true,
      },
    });

    // Notify the sender that their messages were read
    await pusherServer.trigger(`user_${receiverId}`, "messages-read", {
      senderId,
    });

    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
