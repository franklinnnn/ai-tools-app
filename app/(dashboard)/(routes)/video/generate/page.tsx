"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { VideoIcon } from "lucide-react";
import { formSchema } from "./constants";

import { useProModal } from "@/hooks/useProModal";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/heading";
import { Loader } from "@/components/loader";
import { Empty } from "@/components/empty";

const VideoPage = () => {
  const proModal = useProModal();
  const router = useRouter();

  const [video, setVideo] = useState<string>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: undefined,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    try {
      setVideo(undefined);

      const response = await axios.post("/api/video", values);

      setVideo(response.data[0]);

      form.reset();
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

  return (
    <div>
      <Heading
        title="Generate Video"
        description=""
        icon={VideoIcon}
        iconColor="text-orange-600"
        bgColor="bg-orange-600/10"
      />
      <div className="px-4 lg:px-8">
        <div className="flex justify-center w-full mb-4">
          {!video && !isLoading && (
            <video
              className="w-full md:max-w-3xl lg:max-w-5xl aspect-video border bg-black"
              controls
              autoPlay
              loop
              muted
            >
              <source src="/video-generate.mp4" />
            </video>
          )}
          {isLoading && (
            <div className="p-8 w-full md:max-w-3xl lg:max-w-5xl aspect-video flex items-center justify-center rounded-lg">
              <Loader />
            </div>
          )}
          {video && (
            <video
              className="w-full md:max-w-3xl lg:max-w-5xl aspect-video border bg-black"
              controls
              autoPlay
              loop
              muted
            >
              <source src={video} />
            </video>
          )}
        </div>
        <div className="border border-black">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full p-4 px-3 md:px-6 grid grid-cols-12 gap-2 transition"
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="Clown fish swimming around a coral reef"
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
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {/* {isLoading && (
            <div className="p-8 w-full flex items-center justify-center bg-muted rounded-lg">
              <Loader />
            </div>
          )} */}
          {/* {!video && !isLoading && <Empty label="No video generated" />} */}
          {/* {video && (
            <video
              className="w-full aspect-video mt-8 rounded-lg border bg-black"
              controls
            >
              <source src={video} />
            </video>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
