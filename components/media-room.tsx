"use client";

import "@livekit/components-styles";
import {
  LiveKitRoom,
  VideoConference,
  GridLayout,
  ParticipantTile,
} from "@livekit/components-react";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
}

export const MediaRoom = ({ audio, chatId, video }: MediaRoomProps) => {
  const { user } = useUser();
  const [token, setToken] = useState("");

  useEffect(() => {
    if (!user?.firstName || !user?.lastName) return;
    const name = `${user.firstName} ${user.lastName}`;

    (async () => {
      try {
        const resp = await fetch(
          `/api/livekit?room=${chatId}&username=${name}`
        );

        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.error("Video/Audio conference error", e);
      }
    })();
  }, [chatId, user?.firstName, user?.lastName]);

  if (!token) {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Отримуємо токен...
        </p>{" "}
        <Loader2 className="h-7 w-7 animate-spin my-4 text-zinc-500" />
      </div>
    );
  }

  return (
    <LiveKitRoom
      video={video}
      audio={audio}
      token={token}
      connectOptions={{ autoSubscribe: false }}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      data-lk-theme="default"
      style={{ height: "100dvh" }}
    >
      <VideoConference />
    </LiveKitRoom>
  );
};
