"use client";

import { useState } from "react";
import { Flex } from "@/components/ui/primitives";
import { BRAND_NAME } from "@/config";

type LogoProps = {
  variant?: "icon" | "long";
  tone?: "auto" | "light" | "dark";
};

export default function Logo({ variant = "icon", tone = "auto" }: LogoProps) {
  const [hasLogoError, setHasLogoError] = useState(false);
  const isLong = variant === "long";
  const logoSrc = isLong ? "/logo-long.png?v=20260222" : "/logo.png?v=20260222";
  const toneClass = tone === "light" ? "brightness-0 invert" : "";

  return (
    <Flex alignItems="center" gap={2} className="font-bold text-white drop-shadow-lg text-xl">
      {!hasLogoError ? (
        <img
          className={`${isLong ? "h-10 w-auto rounded-lg shadow-sm" : "w-10 h-10 rounded-lg shadow-sm"} ${toneClass}`.trim()}
          src={logoSrc}
          alt={`${BRAND_NAME} logo`}
          width={isLong ? 168 : 40}
          height={40}
          loading="eager"
          decoding="async"
          onError={() => setHasLogoError(true)}
        />
      ) : (
        <span className="tracking-wide">{BRAND_NAME}</span>
      )}
    </Flex>
  );
}
