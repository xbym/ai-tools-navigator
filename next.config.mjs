/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  },
};

export default nextConfig;
