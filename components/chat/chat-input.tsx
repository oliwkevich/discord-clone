"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Plus, Smile } from "lucide-react";
import { Input } from "../ui/input";
import queryString from "query-string";
import axios from "axios";
import { useModal } from "@/hooks/use-modal-store";
import { EmojiPicker } from "../emoji-picker";
import { useRouter } from "next/navigation";

interface ChatInputProps {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: "conversation" | "channel";
}

const formSchema = z.object({
  content: z.string().min(1, "Це поле обовязкове!"),
});

export const ChatInput = ({ apiUrl, name, query, type }: ChatInputProps) => {
  const { onOpen } = useModal();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: { content: "" },
    resolver: zodResolver(formSchema),
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = queryString.stringifyUrl({ url: apiUrl, query });
      await axios.post(url, values);
      form.reset();
      router.refresh();
    } catch (error) {
      console.log("Error while try to send message", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <button
                    type="button"
                    onClick={() => onOpen("messageFile", { apiUrl, query })}
                    className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 
                    hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center"
                  >
                    <Plus className="text-white dark:text-[#313338]" />
                  </button>
                  {isLoading ? (
                    <Input
                      disabled
                      className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 
                  focus-visible:ring-0 focus-visible:ring-offset-0 text-zing-600 dark:text-zinc-200"
                      placeholder="Відправлення..."
                    />
                  ) : (
                    <Input
                      className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 
                    focus-visible:ring-0 focus-visible:ring-offset-0 text-zing-600 dark:text-zinc-200"
                      placeholder={`Повідомлення для ${
                        type === "conversation" ? name : "#" + name
                      }`}
                      {...field}
                    />
                  )}
                  <div className="absolute top-7 right-8">
                    <EmojiPicker
                      onChange={(emoji) =>
                        field.onChange(`${field.value} ${emoji}`)
                      }
                    />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
