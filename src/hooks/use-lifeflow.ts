"use client";

import { useContext } from "react";

import { LifeFlowContext } from "@/context/lifeflow-provider";

export function useLifeFlow() {
  const context = useContext(LifeFlowContext);

  if (!context) {
    throw new Error("useLifeFlow must be used inside LifeFlowProvider.");
  }

  return context;
}
