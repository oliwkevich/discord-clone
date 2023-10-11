"use client";

import { useState } from "react";
import axios from "axios";
import qs from "query-string";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Button } from "../ui/button";

export const DeleteMessageModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onClose, type, data, onOpen } = useModal();
  const isModalOpen = isOpen && type === "deleteMessage";
  const { apiUrl, query } = data;

  const onClick = async () => {
    setIsLoading(true);
    const url = qs.stringifyUrl({
      url: apiUrl || "",
      query,
    });

    try {
      await axios.delete(url);

      onClose();
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Видалення повідомлення
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Ви впевнені, що хочете зробити це? <br />
            Повідомлення буде видалено назавжди.
            <br />
            <span className="text-xs text-red-300">
              Цю дію неможливо буде повернути!
            </span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isLoading} variant="ghost" onClick={onClose}>
              Назад
            </Button>
            <Button
              disabled={isLoading}
              variant="destructive"
              onClick={onClick}
            >
              Видалити
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
