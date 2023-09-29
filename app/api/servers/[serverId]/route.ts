import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();
    const body = await req.json();

    if (!profile) {
      return new NextResponse("Unautorized", { status: 401 });
    }

    if (!params.serverId) {
      return new NextResponse("Server Id missing", { status: 400 });
    }

    const server = await db.server.update({
      where: { id: params.serverId, profileId: profile.id },
      data: { name: body.name, imageUrl: body.imageUrl },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[API] Update server error", error);
    return new NextResponse("Error update server", { status: 500 });
  }
}
