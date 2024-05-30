import { LandingContent } from "@/components/landing-content";
import { LandingFeatures } from "@/components/landing-features";
import { LandingHero } from "@/components/landing-hero";
import { LandingNavbar } from "@/components/landing-navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const LandingPage = () => {
  return (
    <div className="h-full">
      <LandingNavbar />
      <LandingHero />
      {/* <LandingFeatures /> */}
      <LandingContent />
    </div>
  );
};

export default LandingPage;
