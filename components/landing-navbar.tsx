"use client";

import { Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const font = Montserrat({
  weight: "600",
  subsets: ["latin"],
});

export const LandingNavbar = () => {
  const { isSignedIn } = useAuth();

  return (
    <nav className="p-4 bg-transparent flex items-center justify-between">
      <Link href="/" className="flex items-center">
        <div className="relative h-8 w-8 mr-1">
          <Image fill alt="logo" src="/logo.png" />
        </div>

        {/* <h1 className={cn("text-2xl font-bold text-black", font.className)}>
          Egghead
        </h1> */}
        <h1 className="font-title font-bold text-2xl">Egghead</h1>
      </Link>

      <div className="flex items-center gap-x-6 font-body uppercase">
        {/* <div>Tools</div> */}
        {/* <div>Pricing</div> */}
        {/* <Link href="/about">About</Link> */}
        <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
          <Button variant="outline">
            {isSignedIn ? "Dashboard" : "Get Started"}
          </Button>
        </Link>
      </div>
    </nav>
  );
};
