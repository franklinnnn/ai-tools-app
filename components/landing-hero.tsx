"use client";

import { useAuth } from "@clerk/nextjs";
import React from "react";
import TypewriterComponent from "typewriter-effect";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";

export const LandingHero = () => {
  const { isSignedIn } = useAuth();

  return (
    <div className="relative flex text-black font-bolt py-36 mb-24">
      <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl space-y-5 font-extrabold font-title w-3/4 ml-10 py-2 z-10">
        <h1>Create content faster with AI.</h1>
        <div className="flex gap-x-2 text-2xl font-body uppercase">
          <div>Using The Best Tools for</div>
          <div className="text-transparent font-extrabold bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-400">
            <TypewriterComponent
              options={{
                strings: ["conversations.", "images.", "videos."],
                autoStart: true,
                loop: true,
              }}
            />
          </div>
        </div>
        <div className="">
          <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
            <Button>Start Creating</Button>
          </Link>
        </div>
      </div>
      <div className="absolute aspect-square md:w-1/2 h-min-72 top-0 right-12 opacity-95">
        <Image src="/hero2.jpg" alt="hero image" fill />
      </div>
    </div>
  );
};
