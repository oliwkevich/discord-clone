"use client";

import { CircleDot, Dot, Loader2 } from "lucide-react";
import { useSocket } from "./providers/socket-provider";
import { Badge } from "./ui/badge";

export const SocketIndicator = () => {
  const { isConnected } = useSocket();

  if (!isConnected) {
    return (
      <Badge variant="outline" className="bg-yellow-600 text-white border-none">
        Підключення <Loader2 className="w-4 h-4 ml-2 animate-spin" />
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="bg-emerald-600 text-white border-none">
      Live <CircleDot className="w-2 h-2 ml-2 animate-ping" />
    </Badge>
  );
};
