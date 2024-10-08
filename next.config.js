/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "images.ctfassets.net",
      "ultragreen.money",
    ],
  },
};

module.exports = nextConfig;
