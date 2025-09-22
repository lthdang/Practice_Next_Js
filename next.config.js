/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@mui/x-data-grid'],
  modularizeImports: {
    '@mui/x-data-grid': {
      transform: '@mui/x-data-grid/{{member}}',
    },
  },
};

module.exports = nextConfig;
