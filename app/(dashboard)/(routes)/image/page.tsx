"use client";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

import { Heading } from "@/components/heading";

import Link from "next/link";

const imageTools = [
  {
    title: "Generate Image",
    nameOne: "Generate",
    nameTwo: "Image",
    description: "Simple prompt to image generator",
    href: "/image/generate",
    img: "/image-generate.png",
  },
  {
    title: "Remove Background",
    nameOne: "Remove",
    nameTwo: "Background",
    description: "Erase backgrounds, very clean",
    href: "/image/background",
    img: "/image-background-thumbnail.png",
  },
  {
    title: "Upscale Image",
    nameOne: "Upscale",
    nameTwo: "Image",
    description: "Make it look better",
    href: "/image/upscale",
    img: "/image-upscale-thumbnail.png",
  },
];

const ImagePage = () => {
  return (
    <div>
      <Heading
        title="Image Tools"
        description=""
        icon={ImageIcon}
        iconColor="text-pink-600"
        bgColor="bg-pink-600/10"
      />
      <div className="px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {imageTools.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between border  border-black gap-x-2 hover:option-hover"
            >
              <div className="ml-4">
                <h2 className="text-4xl font-title font-bold">
                  {item.nameOne}
                </h2>
                <h3 className="text-2xl font-title font-bold">
                  {item.nameTwo}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
              <div className="relative w-40 h-40 object-cover">
                <Image
                  src={item.img}
                  alt="Tool preview"
                  fill
                  className="object-cover bg-muted"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImagePage;
