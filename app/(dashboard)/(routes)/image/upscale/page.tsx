"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Download, DownloadIcon, ImageIcon, Upload, X } from "lucide-react";
import { formSchema, fileSchema } from "./constants";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useProModal } from "@/hooks/useProModal";
import { Heading } from "@/components/heading";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@clerk/nextjs";
import { v4 as uuidv4 } from "uuid";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardFooter } from "@/components/ui/card";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";

const UpscaleImagePage = () => {
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
      scale: 4,
      enhance: false,
    },
  });

  const fileForm = useForm<z.infer<typeof fileSchema>>({
    resolver: zodResolver(fileSchema),
    defaultValues: {
      scale: 4,
      enhance: false,
    },
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
      const response = await axios.post("/api/image/upscale", values);
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
    console.log(file);
    try {
      if (file) {
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
          scale: values.scale,
          enhance: values.enhance,
        };

        const response = await axios.post("/api/image/upscale", inputValues);
        setOutputImage(response.data);
        console.log(outputImage);
        if (outputImage === null) {
          toast.error("Something went wrong");
        }

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
    setInputImage(undefined);
    setOutputImage(undefined);
    form.reset();
    fileForm.reset();
    router.refresh();
  };

  return (
    <div>
      <Heading
        title="Upscale Image"
        description="Make it look better"
        icon={ImageIcon}
        iconColor="text-pink-600"
        bgColor="bg-pink-600/10"
      />
      <div className="px-4 lg:px-8">
        <div className="flex justify-center w-full mb-12">
          {!inputImage && !outputImage && (
            <div className="max-w-xl">
              <ReactCompareSlider
                itemOne={
                  <ReactCompareSliderImage src="/image-upscale-input.png" />
                }
                itemTwo={
                  <ReactCompareSliderImage src="/image-upscale-output.png" />
                }
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

          {inputImage && outputImage && (
            <div className="max-w-4xl">
              <ReactCompareSlider
                itemOne={<ReactCompareSliderImage src={inputImage} />}
                itemTwo={<ReactCompareSliderImage src={outputImage} />}
              />
              <div className="w-xl mt-4">
                <Button
                  onClick={() => window.open(outputImage)}
                  variant="secondary"
                  className="w-full"
                >
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Download
                </Button>
                {/* <Button
                    className="w-full hover:bg-black hover:text-white"
                    variant="outline"
                    onClick={resetForm}
                    disabled={isLoading}
                  >
                    Reset
                  </Button> */}
              </div>
            </div>
          )}
        </div>
        <div className="border border-black">
          {!showUpload && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col w-full p-4 px-3 md:px-6 gap-2"
              >
                <div className="flex justify-between items-center gap-x-2">
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

                <div className="grid grid-cols-12 items-center gap-x-2">
                  <FormField
                    name="scale"
                    render={({ field }) => (
                      <FormItem className="grid col-span-6 gap-x-4">
                        <div className="col-span-6 items-center my-4">
                          <FormLabel className="text-xs text-muted-foreground">
                            Image scale factor{" "}
                            <span className="text-base mx-1">
                              {field.value}
                            </span>{" "}
                            (min 1, max 10)
                          </FormLabel>
                          <FormControl>
                            <Slider
                              className="col-span-8 items-center py-2"
                              defaultValue={[field.value]}
                              max={10}
                              step={1}
                              onValueChange={(value) =>
                                field.onChange(value[0])
                              }
                              disabled={isLoading}
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                  <Button
                    className="col-span-6"
                    type="submit"
                    disabled={isLoading}
                  >
                    Generate
                  </Button>
                </div>
              </form>
            </Form>
          )}

          {showUpload && (
            <Form {...fileForm}>
              <form
                onSubmit={fileForm.handleSubmit(onSubmitFile)}
                className="flex flex-col w-full p-4 px-3 md:px-6 gap-2"
              >
                <div className="flex justify-between items-center gap-x-2">
                  <FormField
                    control={fileForm.control}
                    name="file"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Input
                            className="flex items-center border border-dashed outline-none focus-visible ring-0 focus-visible:ring-transparent bg-black/5 focus:border-black rounded-none file:bg-black file:text-white"
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

                <div className="grid grid-cols-12 items-center gap-x-2">
                  <FormField
                    name="scale"
                    render={({ field }) => (
                      <FormItem className="grid col-span-6 gap-x-4">
                        <div className="col-span-6 items-center my-4">
                          <FormLabel className="text-xs text-muted-foreground">
                            Image scale factor{" "}
                            <span className="text-base mx-1">
                              {field.value}
                            </span>{" "}
                            (min 1, max 10)
                          </FormLabel>
                          <FormControl>
                            <Slider
                              className="col-span-8 items-center py-2"
                              defaultValue={[field.value]}
                              max={10}
                              step={1}
                              onValueChange={(value) =>
                                field.onChange(value[0])
                              }
                              disabled={isLoading}
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                  <Button
                    className="col-span-6"
                    type="submit"
                    disabled={isLoading}
                  >
                    Generate
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </div>
        {/* <div className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-center items-start">
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
                    <DownloadIcon className="h-4 w-2 mr-2" />
                    Download
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default UpscaleImagePage;
