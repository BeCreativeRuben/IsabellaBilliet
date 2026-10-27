"use client";

import dynamic from "next/dynamic";

const CustomCursor = dynamic(
  () => import("@/components/CustomCursor").then((mod) => mod.CustomCursor),
  { ssr: false },
);

const EasterEggs = dynamic(
  () => import("@/components/EasterEggs").then((mod) => mod.EasterEggs),
  { ssr: false },
);

export function ClientEffects() {
  return (
    <>
      <CustomCursor />
      <EasterEggs />
    </>
  );
}
