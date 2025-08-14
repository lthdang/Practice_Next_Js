/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    // Update these to the locales you need
    locales: ["en", "vi", "ja"],
    defaultLocale: "en",
    // Set to false to avoid runtime error about invalid literal value
    localeDetection: false,
  },
};

module.exports = nextConfig;
