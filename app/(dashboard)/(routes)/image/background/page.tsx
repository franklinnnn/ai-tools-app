"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { DownloadIcon, ImageIcon, Upload, X } from "lucide-react";
import { formSchema, fileSchema } from "./constants";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Card, CardFooter } from "@/components/ui/card";
import { useProModal } from "@/hooks/useProModal";
import { Heading } from "@/components/heading";
import { Loader } from "@/components/loader";
import { Empty } from "@/components/empty";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@clerk/nextjs";
import { v4 as uuidv4 } from "uuid";

const RemoveBackgroundPage = () => {
  const { userId, getToken } = useAuth();
  const proModal = useProModal();
  const router = useRouter();
  const [preview, setPreview] = useState();
  const [images, setImages] = useState<string[]>([]);

  const [showUpload, setShowUpload] = useState(false);
  const [inputImage, setInputImage] = useState<string>();
  const [outputImage, setOutputImage] = useState<string>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  const fileForm = useForm<z.infer<typeof fileSchema>>({
    resolver: zodResolver(fileSchema),
  });

  const isLoading =
    form.formState.isSubmitting || fileForm.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log(values);
      setInputImage(undefined);
      setOutputImage(undefined);

      console.log("HAVE URL");
      setInputImage(values.url);
      const response = await axios.post("/api/image/background", values);
      setOutputImage(response.data);

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

  const onSubmitFile = async (values: z.infer<typeof fileSchema>) => {
    let file = values.file;
    try {
      if (file) {
        console.log(file);
        setInputImage(undefined);
        setOutputImage(undefined);
        setInputImage(URL.createObjectURL(file));
        const { data: fileUpload, error } = await supabase.storage
          .from("uploads")
          .upload(`images/${uuidv4()}.jpg`, file, {
            cacheControl: "3600",
            upsert: false,
          });

        const inputImageUrl = `https://udmmamkjicrltdpdtcrt.supabase.co/storage/v1/object/public/uploads/${fileUpload?.path}`;
        const inputValues = {
          url: inputImageUrl,
        };

        const response = await axios.post("/api/image/background", inputValues);
        setOutputImage(response.data);

        form.reset();
      }
      return 0;
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

  const resetForm = () => {
    form.reset();
  };

  return (
    <div>
      <Heading
        title="Remove Background"
        description="Enhanced image background removal"
        icon={ImageIcon}
        iconColor="text-pink-600"
        bgColor="bg-pink-600/10"
      />
      <div className="px-4 lg:px-8">
        {!isLoading && !outputImage && (
          <div className="grid grid-cols-2 lg:grid-cols-12 gap-2 my-4">
            <div className="relative aspect-square col-span-6 xl:col-span-4">
              <Image
                alt="Sample image"
                fill
                src="/image-background.jpg"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-square bg-muted col-span-6 xl:col-span-4">
              <Image
                alt="Sample image"
                fill
                src="/image-background-removed.png"
                className="object-cover"
              />
            </div>
          </div>
        )}
        <div className="border border-black">
          {!showUpload && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col  w-full p-4 px-3 md:px-6 gap-2"
              >
                <div className="flex justify-between items-center gap-x-2 bg-white">
                  <FormField
                    name="url"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl className="m-0 p-0">
                          <Input
                            className="flex items-center border-0 outline-none focus-visible ring-0 focus-visible:ring-transparent"
                            disabled={isLoading}
                            type="url"
                            placeholder="Enter a URL or upload from your system"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div
                    onClick={() => setShowUpload(true)}
                    className="group relative flex items-center justify-center w-8 h-8 transition hover:cursor-pointer text-muted-foreground hover:text-black"
                  >
                    <div className="absolute px-2 right-0 bottom-8 hidden group-hover:block bg-black text-white text-sm text-nowrap transition">
                      Upload file
                    </div>
                    <Upload />
                  </div>
                </div>

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
                onSubmit={fileForm.handleSubmit(onSubmitFile)}
                className="flex flex-col  w-full p-4 px-3 md:px-6 gap-2"
              >
                <div className="flex justify-between items-center gap-x-2 bg-white">
                  <FormField
                    control={fileForm.control}
                    name="file"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Input
                            className="flex items-center border border-dashed outline-none focus-visible ring-0 focus-visible:ring-transparent bg-black/5 rounded-none file:bg-black file:text-white"
                            disabled={isLoading}
                            type="file"
                            accept=".jpg, .png"
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
                    className="flex items-center justify-center w-8 h-8 transition hover:cursor-pointer text-muted-foreground hover:text-black"
                  >
                    <X />
                  </div>
                </div>

                <Button type="submit" disabled={isLoading}>
                  Generate
                </Button>
              </form>
            </Form>
          )}
        </div>
        <div className="space-y-4 mt-4">
          <div className="grid max-sm:grid-cols-1 grid-cols-2 gap-4 justify-center items-center">
            {inputImage && (
              <div className="relative aspect-square rounded-lg">
                <Image
                  alt="Input image"
                  fill
                  src={inputImage}
                  className="object-contain"
                />
              </div>
            )}

            {!outputImage && isLoading && (
              <div className="h-full flex flex-col gap-y-4 items-center justify-center bg-muted rounded-lg">
                <div className="w-10 h-10 relative animate-spin">
                  <Image alt="Logo" fill src="/logo.png" />
                </div>
                <div className="text-center">
                  <p>Working on your image</p>
                  <p className="text-sm text-muted-foreground">
                    Might take a minute if this is your first image
                  </p>
                </div>
              </div>
            )}

            {outputImage && (
              // <div className="relative aspect-square bg-muted rounded-lg">
              //   <Image
              //     alt="Output image"
              //     fill
              //     src={outputImage}
              //     className="object-cover"
              //   />
              // </div>
              <Card key={outputImage} className="rounded-none overflow-hidden">
                <div className="relative aspect-square">
                  <Image
                    alt="Image"
                    fill
                    src={outputImage}
                    className="object-contain"
                  />
                </div>
                <CardFooter className="p-2">
                  <Button
                    onClick={() => window.open(outputImage)}
                    variant="secondary"
                    className="w-full"
                  >
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveBackgroundPage;
