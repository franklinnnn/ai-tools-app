"use client";
import { useState } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { tools } from "@/app/(landing)/constants";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";

export const LandingFeatures = () => {
  const { isSignedIn } = useAuth();
  const [activeFeature, setActiveFeature] = useState(0);
  const [activeTool, setActiveTool] = useState(0);

  return (
    <div>
      <h1 className="font-title font-bold text-3xl mb-6">
        What you can do with Egghead
      </h1>
      <div className="flex flex-row gap-x-6 font-body text-lg">
        {tools.map((item, index) => (
          <div
            key={item.name}
            className={`${
              activeFeature === index
                ? "text-muted-foreground bg-black px-2"
                : "text-black hover:underline px-2"
            } object-fit hover:cursor-pointer`}
            onClick={() => {
              setActiveFeature(index);
              setActiveTool(0);
            }}
          >
            <p
              className={`${
                activeFeature === index
                  ? "text-muted-foreground bg-black px-2"
                  : "text-black hover:underline px-2"
              } object-fit`}
            >
              {item.name}
            </p>
          </div>
        ))}
      </div>
      <div>
        <div
          key={tools[activeFeature].description}
          className="flex font-title text-2xl border border-black text-white"
        >
          <div className="flex flex-col justify-center bg-black w-1/2 pl-6">
            <div className="flex items-center">
              {/* <item.icon className="h-6 w-6 mr-2 text-pink-600" /> */}
              <h2>{tools[activeFeature].title}</h2>
            </div>
            <p className="text-lg font-body">
              {tools[activeFeature].description}
            </p>
            <div className="text-lg">
              {tools[activeFeature].features.map((feature, index) => (
                <li
                  key={feature.title}
                  onClick={() => setActiveTool(index)}
                  className={`flex items-center gap-x-2 px-2 font-body hover:cursor-pointer ${
                    activeTool === index && "text-black bg-white w-fit"
                  }`}
                >
                  <feature.icon className="w-5 h-5 text-muted-foreground" />
                  <div>{feature.title}</div>
                </li>
              ))}
            </div>
          </div>

          <div className="relative aspect-video w-1/2">
            <div className="flex items-center justify-center min-h-64">
              <Image
                src={tools[activeFeature].features[activeTool].media}
                alt="media"
                fill
                className="object-contain"
              />
            </div>
            <Link
              href={
                isSignedIn
                  ? tools[activeFeature].features[activeTool].url
                  : "/sign-up"
              }
              className="absolute right-1 bottom-1"
            >
              <Button variant="default">Try it out</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
