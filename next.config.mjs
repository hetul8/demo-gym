/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /* Allow Unsplash images */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
