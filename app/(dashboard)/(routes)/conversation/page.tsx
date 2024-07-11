"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { MessageSquare, Send } from "lucide-react";
import { formSchema } from "./constants";
import { useProModal } from "@/hooks/useProModal";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/heading";
import { Loader } from "@/components/loader";
import { Empty } from "@/components/empty";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";

const ConversationPage = () => {
  const proModal = useProModal();
  const router = useRouter();
  const formRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    try {
      const userMessage: ChatCompletionMessageParam = {
        role: "user",
        content: values.prompt,
      };
      const newMessages = [...messages, userMessage];

      const response = await axios.post("/api/conversation", {
        messages: newMessages,
      });

      setMessages((current) => [...current, userMessage, response.data]);

      form.reset();
      formRef.current?.scrollIntoView();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      router.refresh();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div>
      <Heading
        title="Conversation"
        description="Chat with the smartest robot man"
        icon={MessageSquare}
        iconColor="text-fuchsia-600"
        bgColor="bg-fuchsia-600/10"
      />

      <div className="flex flex-col h-[calc(100vh-200px)] overflow-y-none">
        <div className="flex-1 overflow-auto flex flex-col p-4 space-y-4 space-y-reverse">
          {messages.length < 1 && <Empty label="No messages" />}
          {messages
            .sort((a, b) => (a > b ? -1 : 1))
            .map((message) => (
              <div
                key={String(message.content)}
                className={cn(
                  "p-8 w-full flex items-start gap-x-8",
                  message.role === "user"
                    ? "bg-white border border-black/10"
                    : "bg-muted"
                )}
              >
                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                {/* <p className="text-sm">{String(message.content)}</p> */}
                <ReactMarkdown
                  components={{
                    pre: ({ node, ...props }) => (
                      <div className="overflow-auto w-full my-2 bg-slate-200/50 p-2 ">
                        <pre {...props} />
                      </div>
                    ),
                    code: ({ node, ...props }) => (
                      <code className="bg-slate-200/50 p-1" {...props} />
                    ),
                  }}
                  className="text-sm overflow-hidden leading-7"
                >
                  {String(message.content || "")}
                </ReactMarkdown>
              </div>
            ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 flex-shrink-0 flex bg-white">
          <div
            className="w-full bg-white border border-black overflow-hidden"
            ref={formRef}
          >
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className=" w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
              >
                <FormField
                  name="prompt"
                  render={({ field }) => (
                    <FormItem className="col-span-12 lg:col-span-10">
                      <FormControl className="m-0 p-0">
                        <Input
                          className="border-0 outline-none focus-visible ring-0 focus-visible:ring-transparent"
                          disabled={isLoading}
                          placeholder="Hello Egghead"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button className="col-span-2 w-full" disabled={isLoading}>
                  <Send />
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>

      {/* <div className="flex flex-col px-4 lg:px-8 overflow-hidden">
        <div className="overflow-hidden">
          <div className="flex flex-col gap-y-2 font-body">
            {messages
              .sort((a, b) => (a > b ? -1 : 1))
              .map((message) => (
                <div
                  key={String(message.content)}
                  className={cn(
                    "p-8 w-full flex items-start gap-x-8",
                    message.role === "user"
                      ? "bg-white border border-black/10"
                      : "bg-muted"
                  )}
                >
                  {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                  <ReactMarkdown
                    components={{
                      pre: ({ node, ...props }) => (
                        <div className="overflow-auto w-full my-2 bg-slate-200/50 p-2 ">
                          <pre {...props} />
                        </div>
                      ),
                      code: ({ node, ...props }) => (
                        <code className="bg-slate-200/50 p-1" {...props} />
                      ),
                    }}
                    className="text-sm overflow-hidden leading-7"
                  >
                    {String(message.content || "")}
                  </ReactMarkdown>
                </div>
              ))}
          </div>
          {isLoading && (
            <div className="p-8 w-full flex items-center justify-center bg-muted rounded-lg">
              <Loader />
            </div>
          )}
         
        </div>
        <div className="sticky bottom-0 right-0 left-0 w-full bg-white py-2">
          <div
            className="w-full bg-white border border-black overflow-hidden"
            ref={formRef}
          >
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className=" w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
              >
                <FormField
                  name="prompt"
                  render={({ field }) => (
                    <FormItem className="col-span-12 lg:col-span-10">
                      <FormControl className="m-0 p-0">
                        <Input
                          className="border-0 outline-none focus-visible ring-0 focus-visible:ring-transparent"
                          disabled={isLoading}
                          placeholder="Chat"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  className="col-span-12 lg:col-span-2 w-full"
                  disabled={isLoading}
                >
                  Hello
                </Button>
              </form>
            </Form>
          </div>
        </div>
    
      </div> */}
    </div>
  );
};

export default ConversationPage;
