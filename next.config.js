const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  swcMinify: true, // 使用 SWC 进行最小化
  compiler: {
    removeConsole: process.env.NODE_ENV === "production", // 在生产环境中移除 console
  },
  // 如果你需要其他配置,可以在这里添加
};

module.exports = withSentryConfig(
  nextConfig,
  {
    // Sentry options
    silent: true, // Suppresses source map uploading logs during build
    org: "xbym", // 替换为您的Sentry组织名称
    project: "aidaohang", // 替换为您的Sentry项目名称
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,
  }
);