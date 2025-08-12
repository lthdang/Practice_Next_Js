/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    // Update these to the locales you need
    locales: ["en", "vi", "ja"],
    defaultLocale: "en",
    localeDetection: true,
  },
};

module.exports = nextConfig;
