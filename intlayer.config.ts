import { type IntlayerConfig, Locales } from "intlayer";

const config: IntlayerConfig = {
  internationalization: {
    locales: [Locales.THAI, Locales.ENGLISH],
    defaultLocale: Locales.THAI,
  },
  routing: {
    mode: "prefix-all",
  },
  build: {
    optimize: true,
  },
};

export default config;
