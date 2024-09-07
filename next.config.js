const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... other configs
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
};

module.exports = nextConfig;