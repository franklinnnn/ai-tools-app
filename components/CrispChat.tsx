"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("963c27d9-6a37-4c03-9958-902dfcf88415");
  }, []);

  return null;
};
