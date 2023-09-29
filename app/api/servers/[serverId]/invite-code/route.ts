import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 } from "uuid";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unautorized", { status: 401 });
    }

    if (!params.serverId) {
      return new NextResponse("Server Id missing", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
      data: {
        inviteCode: v4(),
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[API] Generate new invite code error", error);
    return new NextResponse("Error generate new invite code", { status: 500 });
  }
}
