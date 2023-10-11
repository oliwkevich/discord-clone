"use client";

import { Video, VideoOff } from "lucide-react";
import { ActionTooltip } from "../action-tooltip";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";

export const ChatVideoButton = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const isVideo = searchParams?.get("video");

  const tooltipLabel = isVideo
    ? "Завершити відео звінок"
    : "Почати відеозвінок";

  const Icon = isVideo ? VideoOff : Video;

  const onClick = () => {
    const url = queryString.stringifyUrl(
      {
        url: pathname || "",
        query: { video: isVideo ? undefined : true },
      },
      { skipNull: true }
    );

    router.push(url);
  };

  return (
    <ActionTooltip side="bottom" label={tooltipLabel}>
      <button onClick={onClick}>
        <Icon className="h-6 w-6 text-zinc-500 dark:text-zinc-400 mr-2" />
      </button>
    </ActionTooltip>
  );
};
