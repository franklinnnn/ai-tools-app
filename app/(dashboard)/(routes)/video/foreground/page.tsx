"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { DivideCircle, Upload, VideoIcon, X } from "lucide-react";
import { formSchema, fileSchema, maskOptions } from "./constants";

import { useProModal } from "@/hooks/useProModal";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/heading";
import { Loader } from "@/components/loader";
import { Empty } from "@/components/empty";
import supabase from "@/lib/supabaseClient";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";

const VideoForegroundPage = () => {
  const proModal = useProModal();
  const router = useRouter();

  const [showUpload, setShowUpload] = useState(false);
  const [inputVideo, setInputVideo] = useState<string>();
  const [outputVideo, setOutputVideo] = useState<string>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      mask: "green-screen",
    },
  });

  const fileForm = useForm<z.infer<typeof fileSchema>>({
    resolver: zodResolver(fileSchema),
    defaultValues: {
      mask: "green-screen",
    },
  });

  const fileRef = fileForm.register("file");

  const isLoading =
    form.formState.isSubmitting || fileForm.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setInputVideo(undefined);
      setOutputVideo(undefined);

      setInputVideo(values.url);

      const response = await axios.post("/api/video/foreground", values);

      setOutputVideo(response.data);

      form.reset();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      } else {
        console.log(error);
        toast.error("Something went wrong");
      }
    } finally {
      router.refresh();
    }
  };

  const onSubmitFile = async (values: z.infer<typeof fileSchema>) => {
    let file = values.file;
    console.log(file);
    // try {
    //   if (file) {
    //     setInputVideo(undefined);
    //     setOutputVideo(undefined);
    //     setInputVideo(URL.createObjectURL(file));
    //     const { data: fileUpload } = await supabase.storage
    //       .from("uploads")
    //       .upload(`videos/${uuidv4()}.mp4`, file, {
    //         cacheControl: "3600",
    //         upsert: false,
    //       });

    //     const inputVideoUrl = `https://udmmamkjicrltdpdtcrt.supabase.co/storage/v1/object/public/uploads/${fileUpload?.path}`;

    //     const inputValues = {
    //       url: inputVideoUrl,
    //       mask: values.mask,
    //     };

    //     const response = await axios.post("/api/video/foreground", inputValues);

    //     setOutputVideo(response.data);

    //     form.reset();
    //   }
    // } catch (error: any) {
    //   if (error?.response?.status === 403) {
    //     proModal.onOpen();
    //   } else {
    //     toast.error("Something went wrong");
    //   }
    // } finally {
    //   router.refresh();
    // }
  };

  return (
    <div>
      <Heading
        title="Extract Foreground"
        description="Superior Video Matting"
        icon={VideoIcon}
        iconColor="text-orange-600"
        bgColor="bg-orange-600/10"
      />
      <div className="px-4 lg:px-8">
        {!isLoading && !outputVideo && (
          <div className="grid grid-cols-4 items-center gap-2 my-4">
            <video
              className="aspect-video col-span-2 object-cover"
              autoPlay
              muted
              loop
            >
              <source src="/video-foreground.mp4" />
            </video>
            <div className="flex rounded-lg">
              <video className="aspect-square object-cover" autoPlay muted loop>
                <source src="/video-foreground-green-screen.mp4" />
              </video>
              <video className="aspect-square object-cover" autoPlay muted loop>
                <source src="/video-foreground-alpha-mask.mp4" />
              </video>
            </div>
          </div>
        )}
        <div>
          {!showUpload && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col border w-full p-4 px-3 md:px-6 focus-within:shadow-sm gap-2 focus-within:border-black"
              >
                <div className="flex justify-between items-center gap-x-2">
                  {!showUpload && (
                    <FormField
                      name="url"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl className="m-0 p-0">
                            <Input
                              className="flex items-center border-transparent outline-none focus-visible ring-0 focus-visible:ring-transparent focus-visible:border-b-black rounded-none"
                              disabled={isLoading}
                              type="url"
                              placeholder="Enter a URL or upload from your system"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}

                  <div
                    onClick={() => setShowUpload(true)}
                    className="flex items-center justify-center w-8 h-8 hover:bg-black hover:text-white transition hover:cursor-pointer"
                  >
                    <Upload />
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="mask"
                  render={({ field }) => (
                    <FormItem className="col-span-12 lg:col-span-2">
                      <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-none">
                            <SelectValue defaultValue={field.value} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-none">
                          {maskOptions.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                              className="rounded-none"
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <Button
                  className="col-span-12 lg:col-span-2"
                  type="submit"
                  disabled={isLoading}
                >
                  Generate
                </Button>
              </form>
            </Form>
          )}

          {showUpload && (
            <Form {...fileForm}>
              <form
                onSubmit={form.handleSubmit(onSubmitFile)}
                className="flex flex-col border w-full p-4 px-3 md:px-6 focus-within:shadow-sm gap-2"
              >
                <div className="flex justify-between items-center gap-x-2">
                  <FormField
                    control={fileForm.control}
                    name="file"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Input
                            className="flex items-center border border-dashed outline-none focus-visible ring-0 focus-visible:ring-transparent bg-black/5 focus:border-black rounded-none"
                            disabled={isLoading}
                            type="file"
                            accept=".mp4"
                            onChange={(e) =>
                              field.onChange(
                                e.target.files ? e.target.files[0] : null
                              )
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div
                    onClick={() => setShowUpload(false)}
                    className="flex items-center justify-center w-8 h-8 hover:bg-black hover:text-white transition hover:cursor-pointer"
                  >
                    <X />
                  </div>
                </div>
                <FormField
                  control={fileForm.control}
                  name="mask"
                  render={({ field }) => (
                    <FormItem className="col-span-12 lg:col-span-2">
                      <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-none">
                            <SelectValue defaultValue={field.value} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-none">
                          {maskOptions.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                              className="rounded-none"
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <Button
                  className="col-span-12 lg:col-span-2"
                  type="submit"
                  disabled={isLoading}
                >
                  Generate
                </Button>
              </form>
            </Form>
          )}
        </div>
        <div className="space-y-4 mt-4">
          {/* {isLoading && (
            <div className="p-8 w-full flex items-center justify-center bg-muted rounded-lg">
            <Loader />
            </div>
          )} */}
          {!outputVideo && !isLoading && <Empty label="No video generated" />}

          <div className="grid max-sm:grid-cols-1 grid-cols-2 gap-4 justify-center items-center">
            {inputVideo && (
              <video
                className="w-full aspect-video mt-8 rounded-lg"
                autoPlay
                muted
                loop
              >
                <source src={inputVideo} />
              </video>
            )}
            {!outputVideo && isLoading && (
              <div className="h-full flex flex-col gap-y-4 items-center justify-center bg-muted rounded-lg">
                <div className="w-10 h-10 relative animate-spin">
                  <Image alt="Logo" fill src="/logo.png" />
                </div>
                <div className="text-center">
                  <p>Working on your video</p>
                  <p className="text-sm text-muted-foreground">
                    Might take a minute if this is your first video
                  </p>
                </div>
              </div>
            )}
            {outputVideo && (
              <video
                className="w-full aspect-video mt-8 rounded-lg "
                autoPlay
                muted
                loop
              >
                <source src={outputVideo} />
              </video>
            )}
          </div>
          {/* <div className="grid max-sm:grid-cols-1 grid-cols-2 gap-4">
            <video
              className="w-full aspect-video mt-8 rounded-lg"
              controls
              autoPlay
              muted
              loop
            >
              <source src="https://udmmamkjicrltdpdtcrt.supabase.co/storage/v1/object/public/uploads/videos/aruuuu.mp4" />
            </video>
            <video
              className="w-full aspect-video mt-8 rounded-lg "
              controls
              autoPlay
              muted
              loop
            >
              <source src="https://replicate.delivery/pbxt/R6t2bxVYLd7xH9J9e1Rtw7i2qGYgaBRqQF8zFEqAU4BTtwXJA/green-screen.mp4" />
            </video>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default VideoForegroundPage;
