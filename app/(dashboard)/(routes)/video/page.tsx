"use client";
import { VideoIcon } from "lucide-react";
import { Heading } from "@/components/heading";
import Link from "next/link";
import Image from "next/image";

const videoTools = [
  {
    title: "Generate Video",
    nameOne: "Generate",
    nameTwo: "Video",
    description: "Simple prompt to video generator",
    href: "/video/generate",
    src: "/video-generate-thumbnail.gif",
  },
  {
    title: "Extract Foreground",
    nameOne: "Extract",
    nameTwo: "Foreground",
    description: "Make green screens",
    href: "/video/foreground",
    src: "/video-foreground-thumbnail.gif",
  },
  {
    title: "Add Caption",
    nameOne: "Add",
    nameTwo: "Caption",
    description: "Automatically add captions",
    href: "/video/caption",
    src: "/video-caption-thumbnail.gif",
  },
];

const VideoPage = () => {
  return (
    <div>
      <Heading
        title="Video Tools"
        description=""
        icon={VideoIcon}
        iconColor="text-orange-600"
        bgColor="bg-orange-600/10"
      />
      <div className="px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {videoTools.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between gap-x-2 border hover:option-hover active:option-hover"
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
                  src={item.src}
                  alt="Tool preview"
                  fill
                  className="object-cover"
                />
                {/* <video className="object-fit" autoPlay loop muted>
                  <source src={item.src} />
                </video> */}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
