"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { DownloadIcon, VideoIcon } from "lucide-react";
import { fontOptions, formSchema, subsPositionOptions } from "./constants";

import { useProModal } from "@/hooks/useProModal";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/heading";
import { Empty } from "@/components/empty";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import supabase from "@/lib/supabaseClient";
import { Card, CardFooter } from "@/components/ui/card";

const VideoCaptionPage = () => {
  const proModal = useProModal();
  const router = useRouter();

  const [showUpload, setShowUpload] = useState(false);
  const [outputVideo, setOutputVideo] = useState<string>();
  const [outputTranscript, setOutputTranscript] = useState<string>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transcript: undefined,
      // output_video: true,
      // output_transcript: true,
      subs_position: "center",
      color: "white",
      highlight_color: "orange",
      // font_size: 7,
      // max_chars: 20,
      // opacity: 0,
      font: "Poppins/Poppins-Bold.ttf",
      // stroke_color: "black",
      // stroke_width: 2.6,
      // kerning: -5,
      // right_to_left: false,
      // translate: false,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    let video = values.video;
    let transcript = values.transcript;

    try {
      setOutputVideo(undefined);
      setOutputTranscript(undefined);

      console.log(values);

      if (transcript) {
        const { data: transcriptUpload } = await supabase.storage
          .from("uploads")
          .upload(`videos/caption/${uuidv4()}.json`, transcript, {
            cacheControl: "3600",
            upsert: false,
          });

        const { data: videoUpload } = await supabase.storage
          .from("uploads")
          .upload(`videos/${uuidv4()}.mp4`, video, {
            cacheControl: "3600",
            upsert: false,
          });

        const inputTranscriptUrl = `https://udmmamkjicrltdpdtcrt.supabase.co/storage/v1/object/public/uploads/${transcriptUpload?.path}`;
        const inputVideoUrl = `https://udmmamkjicrltdpdtcrt.supabase.co/storage/v1/object/public/uploads/${videoUpload?.path}`;

        const inputValues = {
          video_file_input: inputVideoUrl,
          transcript_file_input: inputTranscriptUrl,
          color: values.color,
          highlight_color: values.highlight_color,
          subs_position: values.subs_position,
        };

        const response = await axios.post("/api/video/caption", inputValues);

        console.log(response);
        setOutputVideo(response.data?.[0]);
        setOutputTranscript(response.data?.[1]);

        await supabase.storage.from("uploads").remove([inputTranscriptUrl]);
        await supabase.storage.from("uploads").remove([inputVideoUrl]);

        form.reset();
      } else {
        const { data: videoUpload } = await supabase.storage
          .from("uploads")
          .upload(`videos/${uuidv4()}.mp4`, video, {
            cacheControl: "3600",
            upsert: false,
          });

        const inputVideoUrl = `https://udmmamkjicrltdpdtcrt.supabase.co/storage/v1/object/public/uploads/${videoUpload?.path}`;

        const inputValues = {
          video_file_input: inputVideoUrl,
          color: values.color,
          highlight_color: values.highlight_color,
          subs_position: values.subs_position,
        };

        const response = await axios.post("/api/video/caption", inputValues);

        console.log(response);
        setOutputVideo(response.data?.[0]);
        setOutputTranscript(response.data?.[1]);

        await supabase.storage.from("uploads").remove([inputVideoUrl]);
        form.reset();
      }

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

  const resetForm = () => {
    setOutputVideo(undefined);
    setOutputTranscript(undefined);
    form.reset();
    router.refresh();
  };

  return (
    <div>
      <Heading
        title="Add Caption"
        description="may it works maybe not"
        icon={VideoIcon}
        iconColor="text-orange-600"
        bgColor="bg-orange-600/10"
      />
      <div className="px-4 lg:px-8 pb-12">
        <div className="w-full flex items-center justify-center my-8">
          {!outputVideo && !isLoading && (
            <div className="flex flex-col md:flex-row gap-2">
              <video
                className="aspect-square md:w-72 object-cover"
                autoPlay
                controls
                loop
                muted
              >
                <source src="/video-caption.mp4" />
              </video>
              <video
                className="aspect-square md:w-72 object-cover"
                autoPlay
                controls
                loop
                muted
              >
                <source src="/video-caption-2.mp4" />
              </video>
            </div>
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
            <Card key={outputVideo} className="overflow-hidden rounded-none">
              <video className="aspect-auto" autoPlay controls muted loop>
                <source src={outputVideo} />
              </video>
              <CardFooter className="p-2">
                <Button
                  onClick={() => window.open(outputTranscript)}
                  variant="secondary"
                  className="w-full"
                >
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Transcript
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
        <div className="border border-black">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col w-full p-4 px-3 md:px-6 gap-2"
            >
              <FormField
                control={form.control}
                name="video"
                render={({ field }) => (
                  <FormItem className="w-full  hover:border-black px-2">
                    <FormLabel className="text-sm text-muted-foreground">
                      Video file
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="flex items-center border border-dashed outline-none focus-visible ring-0 focus-visible:ring-transparent bg-black/5 focus:border-black rounded-none file:bg-black file:text-white"
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

              <FormField
                control={form.control}
                name="transcript"
                render={({ field }) => (
                  <FormItem className="w-full px-2">
                    <FormLabel className="text-sm text-muted-foreground">
                      Transcript file
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="flex items-center border border-dashed outline-none focus-visible ring-0 focus-visible:ring-transparent bg-black/5 focus:border-black rounded-none file:bg-black file:text-white"
                        disabled={isLoading}
                        type="file"
                        accept=".json"
                        onChange={(e) =>
                          field.onChange(
                            e.target.files ? e.target.files[0] : null
                          )
                        }
                      />
                    </FormControl>
                    <FormLabel className="text-xs text-muted-foreground ml-4">
                      Will be used for words if provided
                    </FormLabel>
                  </FormItem>
                )}
              />
              <div className="flex gap-x-2 mt-4">
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-sm text-muted-foreground">
                        Color
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="border-black outline-none rounded-none focus-visible ring-0 focus-visible:ring-transparent"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="highlight_color"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-sm text-muted-foreground">
                        Highlight color
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="border-black outline-none rounded-none focus-visible ring-0 focus-visible:ring-transparent"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="font"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-sm text-muted-foreground">
                      Font
                    </FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="rounded-none border-black">
                          <SelectValue defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-none border-black">
                        {fontOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            style={option.style}
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

              <FormField
                control={form.control}
                name="subs_position"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-sm text-muted-foreground">
                      Caption position
                    </FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="rounded-none border-black">
                          <SelectValue defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-none border-black">
                        {subsPositionOptions.map((option) => (
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
              <div className="grid grid-cols-12 mt-4 gap-x-4">
                <Button
                  onClick={resetForm}
                  variant="outline"
                  className="col-span-6 lg:col-span-3"
                  type="reset"
                  disabled={isLoading}
                >
                  Reset
                </Button>
                <Button
                  className="col-span-6 lg:col-span-3"
                  type="submit"
                  disabled={isLoading}
                >
                  Generate
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default VideoCaptionPage;
