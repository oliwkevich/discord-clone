import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const profile = await currentProfile();
    const body = await req.json();
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("Unautorized", { status: 401 });
    }

    if (!serverId || !params.channelId) {
      return new NextResponse("Server and Channel IDs is required", {
        status: 401,
      });
    }

    if (body.name === "general") {
      return new NextResponse("Channel name cant be 'general'", {
        status: 400,
      });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: { in: [MemberRole.ADMIN, MemberRole.MODERATOR] },
          },
        },
      },
      data: {
        channels: {
          update: {
            where: { id: params.channelId, NOT: { name: "general" } },
            data: { name: body.name, type: body.type },
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[API] Update channel error", error);
    return new NextResponse("Error update channel", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("Unautorized", { status: 401 });
    }

    if (!serverId || !params.channelId) {
      return new NextResponse("Server and Channel IDs is required", {
        status: 401,
      });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: { in: [MemberRole.ADMIN, MemberRole.MODERATOR] },
          },
        },
      },
      data: {
        channels: {
          delete: { id: params.channelId, name: { not: "general" } },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[CHANNEL_DELETE]: ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
