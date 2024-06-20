"use client";

import { cn } from "@/lib/utils";
import {
  Code,
  ImageIcon,
  LayoutDashboard,
  MessageSquare,
  Music,
  Settings,
  Video,
} from "lucide-react";
import { Roboto_Slab } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import FreeCounter from "./free-counter";
// const robotoSlab = Roboto_Slab({ weight: "600", subsets: ["latin"] });

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-orange-600",
  },
  {
    label: "Conversation",
    icon: MessageSquare,
    href: "/conversation",
    color: "text-fuchsia-600",
  },
  {
    label: "Image",
    icon: ImageIcon,
    href: "/image",
    color: "text-pink-600",
  },
  {
    label: "Video",
    icon: Video,
    href: "/video",
    color: "text-violet-600",
  },
  // {
  //   label: "Music Generation",
  //   icon: Music,
  //   href: "/music",
  //   color: "text-sky-600",
  // },
  // {
  //   label: "Code Generation",
  //   icon: Code,
  //   href: "/code",
  //   color: "text-green-600",
  // },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
    color: "text-slate-300",
  },
];

interface SidebarProps {
  apiLimitCount: number;
  isPro: boolean;
}

export const Sidebar = ({ apiLimitCount = 0, isPro = false }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-white text-black border-r">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <div className="relative w-8 h-8 mr-2">
            <Image fill alt="logo" src="/logo.png" />
          </div>
          <h1 className="text-2xl font-bold font-title">Egghead</h1>
        </Link>
        <div className="space-y-1 overflow-none">
          {routes.map((route) => {
            let style;
            if (pathname.includes(route.href)) {
              style = "text-black bg-muted";
            } else style = "text-zinc-400";
            return (
              <Link
                href={route.href}
                key={route.href}
                className={cn(
                  "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer transition overflow-none hover:text-black",
                  style
                )}
              >
                <div className="flex items-center flex-1">
                  <route.icon className={cn("h-5 w-5 mr-2", route.color)} />
                  {route.label}
                </div>
              </Link>
            );
          })}
          {/* {routes.map((route) => (
            <Link
              href={route.href}
              key={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer transition overflow-none",
                pathname === route.href ? "text-black" : "text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-2", route.color)} />
                {route.label}
              </div>
            </Link>
          ))} */}
        </div>
      </div>
      {/* <FreeCounter apiLimitCount={apiLimitCount} isPro={isPro} /> */}
    </div>
  );
};
