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
    // <div className="text-black font-bold py-36 text-center space-y-3">
    //   <div className="text-4xl sm:text-5xl md:tet-6xl lg:text-7xl space-y-5 font-extrabold">
    //     <h1>The Best AI Tool for</h1>
    //     <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
    //       <TypewriterComponent
    //         options={{
    //           strings: ["Chatbot.", "Photo.", "Music.", "Video.", "Code."],
    //           autoStart: true,
    //           loop: true,
    //         }}
    //       />
    //     </div>
    //   </div>

    //   <div className="text-sm md:text-xl font-light text-zinc-400">
    //     Create content using AI 10x faster
    //   </div>
    //   <div>
    //     <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
    //       <Button
    //         variant="premium"
    //         className="md:text-lg p-4 mg:p-4 rounded-full font-semibold"
    //       >
    //         Start Generating For Free
    //       </Button>
    //     </Link>
    //   </div>
    //   <div className="text-zinc-400 text-xs md:text-sm font-normal">
    //     No credit card required
    //   </div>
    // </div>
    <div className="relative flex  text-black font-bolt py-36 mb-24">
      <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl space-y-5 font-extrabold font-title w-3/4 ml-10 py-2 z-10">
        <h1>Create content faster with AI.</h1>
        <div className="flex gap-x-2 text-2xl font-body uppercase">
          <div>Using The Best Tools for</div>
          <div className="text-transparent font-extrabold bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400">
            <TypewriterComponent
              options={{
                strings: ["chatbot.", "image.", "video."],
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
        <Image src="/hero.jpg" alt="hero image" fill />
      </div>
    </div>
  );
};
