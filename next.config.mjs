// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cf.bstatic.com',
        port: '',
        pathname: '/xdata/images/hotel/**', // This pattern allows any path under /xdata/images/hotel/
      },
      {
        protocol: 'https',
        hostname: 'img.freepik.com', // Added to allow images from Freepik
        port: '',
        pathname: '/free-photo/**', // This pattern allows any path under /free-photo/
      },
    ],
  },
};

export default nextConfig;
