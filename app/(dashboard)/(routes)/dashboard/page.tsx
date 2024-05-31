"use client";

import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ImageIcon,
  MessageSquare,
  Music,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

const tools = [
  {
    label: "Conversation",
    icon: MessageSquare,
    color: "text-fuchsia-500",
    bgColor: "bg-fuchsia-500/10",
    href: "/conversation",
  },
  {
    label: "Image Tools",
    icon: ImageIcon,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    href: "/image",
  },
  {
    label: "Video Tools",
    icon: Video,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    href: "/video",
  },
  // {
  //   label: "Music Generation",
  //   icon: Music,
  //   color: "text-sky-500",
  //   bgColor: "bg-sky-500/10",
  //   href: "/music",
  // },
  // {
  //   label: "Code Generation",
  //   icon: MessageSquare,
  //   color: "text-green-500",
  //   bgColor: "bg-green-500/10",
  //   href: "/code",
  // },
];

const DashboardPage = () => {
  const router = useRouter();

  return (
    <div>
      <div className="mb-8 space-y-4 text-center">
        <h2 className="text-4xl md:text-7xl font-title font-bold">
          Welcome to Egghead
        </h2>

        <p className="text-muted-foreground font-light text-sm md:text-lg">
          Make robots do it for you{" "}
        </p>
      </div>
      <div className="px-4 md:px-20 lg:px-32 space-y-4">
        {tools.map((tool) => (
          <Card
            onClick={() => router.push(tool.href)}
            key={tool.href}
            className="p-4 border flex items-center justify-between hover:option-hover rounded-none cursor-pointer"
          >
            <div className="flex items-center gap-x-4">
              <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                <tool.icon className={cn("w-8 h-8", tool.color)} />
              </div>
              <div className=" font-bold">{tool.label}</div>
            </div>
            <ArrowRight className="w-5 h-5" />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
