"use client";

import { useLocale } from "next-intlayer";
import { Button } from "./primitives";
import { Locales } from "intlayer";
import { Languages } from "lucide-react";

export default function LocaleSwitcher() {
  const localeData = useLocale();
  const locale = localeData?.locale || Locales.THAI;
  const setLocale = localeData?.setLocale || (() => {});

  const toggleLocale = () => {
    const nextLocale = locale === Locales.ENGLISH ? Locales.THAI : Locales.ENGLISH;
    setLocale(nextLocale);
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      className="p-2 rounded-full min-w-0"
      onClick={toggleLocale}
      title={locale === Locales.ENGLISH ? "เปลี่ยนเป็นภาษาไทย" : "Switch to English"}
    >
      <Languages className="w-5 h-5" />
      <span className="ml-1 text-[10px] font-black uppercase">
        {locale === Locales.ENGLISH ? "EN" : "TH"}
      </span>
    </Button>
  );
}
