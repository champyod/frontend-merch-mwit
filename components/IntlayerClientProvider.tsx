"use client";

import { IntlayerClientProvider as Provider } from "next-intlayer";
import type { FC, ReactNode } from "react";

export const IntlayerClientProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return <Provider>{children}</Provider>;
};
